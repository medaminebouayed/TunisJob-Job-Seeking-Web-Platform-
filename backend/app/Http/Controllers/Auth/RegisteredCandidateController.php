<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidate;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredCandidateController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'gender' => ['nullable', 'string', 'max:255'],
            'birthDate' => ['nullable', 'date'],
        ]);
 
        $user = User::create([
            'name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'candidate',
        ]);
 
        Candidate::create([
            'user_id' => $user->id,
            'prenom' => $request->firstName,
            'nom' => $request->lastName,
            'civilite' => $request->gender,
            'date_naissance' => $request->birthDate,
        ]);
 
        event(new Registered($user));
 
        Auth::login($user);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('candidate'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}
