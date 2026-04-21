<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = Auth::user();
        
        // Load recruiter (with enterprise) or candidate relations
        if ($user->role === 'recruiter') {
            $user->load('recruiter.enterprise');
        } elseif ($user->role === 'candidate') {
            $user->load('candidate');
        }

        // Generate Sanctum token for API-based login
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'role' => $user->role,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 200);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        // Revoke the token that was used to authenticate the current request
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
