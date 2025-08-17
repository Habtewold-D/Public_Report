<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\IssueImage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class IssueController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Issue::with(['reporter:id,name,email', 'sector:id,name,email', 'images']);

        if ($user->role === 'admin') {
            // Admin sees all
        } elseif ($user->role === 'sector') {
            // Sector user sees only issues assigned to them
            $query->where('sector_id', $user->id);
        } else {
            // Citizen sees only their own
            $query->where('user_id', $user->id);
        }

        $issues = $query->latest()->paginate(20);

        // Map image paths to URLs
        $issues->getCollection()->transform(function ($issue) {
            $issue->images->transform(function ($img) {
                $img->url = Storage::url($img->path);
                return $img;
            });
            return $issue;
        });

        return response()->json(['data' => $issues]);
    }

    public function publicIndex(Request $request)
    {
        $query = Issue::with(['sector:id,name,email', 'images'])
            ->whereIn('status', ['submitted','inprogress','solved']);

        // Search by description
        if ($q = $request->string('q')->toString()) {
            $query->where('description', 'like', "%{$q}%");
        }

        // Filter by sector name (public dropdown provides names)
        if ($sectorName = $request->string('sector')->toString()) {
            $query->whereHas('sector', function ($q) use ($sectorName) {
                $q->where('name', $sectorName);
            });
        }

        // Map UI status to internal status values
        $statusMap = [
            'open' => 'submitted',
            'progress' => 'inprogress',
            'resolved' => 'solved',
            'submitted' => 'submitted',
            'inprogress' => 'inprogress',
            'solved' => 'solved',
        ];
        $statusParam = $request->string('status')->toString();
        if ($statusParam && isset($statusMap[$statusParam])) {
            $query->where('status', $statusMap[$statusParam]);
        }

        $issues = $query->latest()->paginate(20);

        // Map image paths to URLs
        $issues->getCollection()->transform(function ($issue) {
            $issue->images->transform(function ($img) {
                $img->url = Storage::url($img->path);
                return $img;
            });
            return $issue;
        });

        return response()->json(['data' => $issues]);
    }

    public function show(Issue $issue)
    {
        $user = Auth::user();
        // Authorize access
        if (!($user->role === 'admin' || $issue->user_id === $user->id || ($user->role === 'sector' && $issue->sector_id === $user->id))) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $issue->load(['reporter:id,name,email', 'sector:id,name,email', 'images']);
        $issue->images->transform(function ($img) {
            $img->url = Storage::url($img->path);
            return $img;
        });

        return response()->json(['data' => $issue]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'description' => ['required', 'string'],
            'sector_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($q) {
                    return $q->where('role', 'sector');
                }),
            ],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'images' => ['sometimes', 'array', 'max:5'],
            'images.*' => ['file', 'mimes:jpeg,jpg,png,webp', 'max:10240'], // 10MB each
        ]);

        // Create Issue
        $issue = Issue::create([
            'user_id' => $user->id,
            'sector_id' => $validated['sector_id'],
            'description' => $validated['description'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'status' => 'submitted',
        ]);

        // Handle images if any
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store("issues/{$issue->id}", 'public');
                IssueImage::create([
                    'issue_id' => $issue->id,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getClientMimeType(),
                ]);
            }
        }

        $issue->load('images');
        $issue->images->transform(function ($img) {
            $img->url = Storage::url($img->path);
            return $img;
        });

        return response()->json(['message' => 'Issue created', 'data' => $issue], 201);
    }

    public function updateStatus(Request $request, Issue $issue)
    {
        $user = Auth::user();

        // Only sector assigned to the issue or admin can change status
        if (!($user->role === 'admin' || ($user->role === 'sector' && $issue->sector_id === $user->id))) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['submitted','inprogress','solved'])],
        ]);

        $current = $issue->status;
        $next = $validated['status'];

        // Enforce workflow: submitted -> inprogress -> solved
        $allowed = [
            'submitted' => ['inprogress'],
            'inprogress' => ['solved'],
            'solved' => [],
        ];

        if ($current === $next) {
            return response()->json(['message' => 'No change', 'data' => $issue]);
        }

        if (!isset($allowed[$current]) || !in_array($next, $allowed[$current], true)) {
            return response()->json(['message' => "Invalid status transition from {$current} to {$next}"], 422);
        }

        $issue->status = $next;
        $issue->save();

        return response()->json(['message' => 'Status updated', 'data' => $issue]);
    }
}
