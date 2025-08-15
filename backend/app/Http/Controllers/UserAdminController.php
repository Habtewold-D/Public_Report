<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserAdminController extends Controller
{
    // Ensure only admins can manage users
    protected function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Forbidden');
        }
    }

    // GET /api/users
    public function index(Request $request)
    {
        $this->authorizeAdmin();
        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'first_name', 'last_name', 'email', 'role', 'created_at']);
        return response()->json(['data' => $users]);
    }

    // PUT /api/users/{user}
    public function update(Request $request, User $user)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'role' => ['sometimes', 'in:citizen,sector,admin'],
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        if (array_key_exists('role', $validated)) {
            $user->role = $validated['role'];
        }
        if (array_key_exists('name', $validated)) {
            $user->name = $validated['name'];
        }
        if (array_key_exists('email', $validated)) {
            $user->email = $validated['email'];
        }

        $user->save();

        return response()->json(['message' => 'User updated', 'data' => $user]);
    }
}
