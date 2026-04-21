<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Recruiter;
use App\Models\Enterprise;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredRecruiterController extends Controller
{
    /**
     * Handle an incoming registration request for recruiters.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nom_entreprise' => ['required', 'string', 'max:255'],
            'secteur_activite' => ['required', 'string', 'max:255'],
            'fonction_entreprise' => ['required', 'string', 'max:255'],
            'telephone_pro' => ['required', 'string', 'max:20'],
        ]);

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'recruiter'
        ]);

        // Create the enterprise
        $enterprise = Enterprise::create([
            'nom_entreprise' => $request->nom_entreprise,
            'secteur_activite' => $request->secteur_activite,
        ]);

        // Create the recruiter profile linked to user and enterprise
        Recruiter::create([
            'user_id' => $user->id,
            'enterprise_id' => $enterprise->id,
            'fonction_entreprise' => $request->fonction_entreprise,
            'telephone_pro' => $request->telephone_pro,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('recruiter.enterprise'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}
