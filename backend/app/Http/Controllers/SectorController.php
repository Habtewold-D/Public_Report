<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SectorController extends Controller
{
    // Ensure only admins can manage sectors
    protected function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Forbidden');
        }
    }

    // GET /api/sectors
    public function index(Request $request)
    {
        $this->authorizeAdmin();
        $sectors = User::query()
            ->where('role', 'sector')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'first_name', 'last_name', 'role', 'created_at']);
        return response()->json(['data' => $sectors]);
    }

    // POST /api/sectors { name: string }
    public function store(Request $request)
    {
        $this->authorizeAdmin();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        // Generate email from name like `sector-name@report.com`
        $base = Str::slug($data['name']);
        $email = $base . '@report.com';

        // Ensure uniqueness; if taken, append -2, -3, ...
        $suffix = 2;
        $candidate = $email;
        while (User::where('email', $candidate)->exists()) {
            $candidate = $base . '-' . $suffix . '@report.com';
            $suffix++;
        }
        $email = $candidate;

        $user = User::create([
            'name' => $data['name'],
            'first_name' => $data['name'],
            'last_name' => '',
            'email' => $email,
            'password' => Hash::make('password'), // default password
            'role' => 'sector',
        ]);

        return response()->json(['message' => 'Sector created', 'data' => $user], 201);
    }

    // PUT /api/sectors/{id} { name?: string, email?: string }
    public function update(Request $request, User $sector)
    {
        $this->authorizeAdmin();
        if ($sector->role !== 'sector') {
            abort(404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $sector->id],
        ]);

        if (array_key_exists('name', $validated)) {
            $sector->name = $validated['name'];
            // Keep first_name in sync with display name
            $sector->first_name = $validated['name'];
        }
        if (array_key_exists('email', $validated)) {
            $sector->email = $validated['email'];
        }
        $sector->save();

        return response()->json(['message' => 'Sector updated', 'data' => $sector]);
    }

    // DELETE /api/sectors/{id}
    public function destroy(Request $request, User $sector)
    {
        $this->authorizeAdmin();
        if ($sector->role !== 'sector') {
            abort(404);
        }
        $sector->delete();
        return response()->json(['message' => 'Sector deleted']);
    }
}
