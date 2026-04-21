<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserAdminController extends Controller
{
    public function index()
    {
        // Load candidates (users with role 'candidate') and their candidate profile
        $candidates = User::where('role', 'candidate')->with('candidate')->latest()->get();
        return response()->json($candidates);
    }

    public function destroy(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
