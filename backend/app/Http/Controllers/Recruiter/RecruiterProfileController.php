<?php

namespace App\Http\Controllers\Recruiter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecruiterProfileController extends Controller
{
    /**
     * Get the authenticated recruiter's profile alongside their enterprise.
     */
    public function show()
    {
        $user = Auth::user();
        return response()->json($user->load('recruiter.enterprise'));
    }

    /**
     * Update the recruiter's user and professional profile.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'prenom' => 'nullable|string|max:255',
            'nom' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'fonction_entreprise' => 'required|string|max:255',
            'telephone_pro' => 'nullable|string|max:20',
        ]);

        $user = Auth::user();
        
        $name = trim(($request->prenom ?? '') . ' ' . ($request->nom ?? ''));
        if ($name) {
            $user->name = $name;
        }
        $user->email = $request->email;
        $user->save();

        if ($user->recruiter) {
            $user->recruiter->fonction_entreprise = $request->fonction_entreprise;
            $user->recruiter->telephone_pro = $request->telephone_pro;
            $user->recruiter->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user->load('recruiter.enterprise')
        ]);
    }

    /**
     * Update the recruiter's associated enterprise details.
     */
    public function updateEnterprise(Request $request)
    {
        $request->validate([
            'nom_entreprise' => 'required|string|max:255',
            'secteur_activite' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'site_web' => 'nullable|string|max:255',
            'ville_siege' => 'nullable|string|max:255',
            'siret_ou_matricule_fiscal' => 'nullable|string|max:255',
            'logo_url' => 'nullable|string',
            'banniere_url' => 'nullable|string',
            'taille_effectif' => 'nullable|integer',
            'annee_creation' => 'nullable|integer',
            'adresse_siege' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();

        if ($user->recruiter && $user->recruiter->enterprise) {
            $user->recruiter->enterprise->update($request->only([
                'nom_entreprise',
                'secteur_activite',
                'description',
                'site_web',
                'ville_siege',
                'siret_ou_matricule_fiscal',
                'logo_url',
                'banniere_url',
                'taille_effectif',
                'annee_creation',
                'adresse_siege'
            ]));
            
            return response()->json([
                'message' => 'Enterprise updated successfully',
                'data' => $user->recruiter->enterprise
            ]);
        }

        return response()->json(['error' => 'Enterprise not found.'], 404);
    }

    /**
     * Upload enterprise logo using native move() to avoid finfo dependency crash.
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|file|max:2048',
        ]);

        $file = $request->file('logo');
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($extension, $allowedExtensions)) {
            return response()->json(['error' => 'Format d\'image non supporté (JPG, PNG, GIF, WEBP uniquement)'], 422);
        }

        $user = Auth::user();
        if (!$user->recruiter || !$user->recruiter->enterprise) {
            return response()->json(['error' => 'Enterprise not found'], 404);
        }

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $fileName = 'logo_' . $user->recruiter->enterprise->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Manual move to public/storage/logos to bypass finfo/flysystem constraints
            $destinationPath = public_path('storage/logos');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            $file->move($destinationPath, $fileName);
            $logoUrl = asset('storage/logos/' . $fileName);

            $enterprise = $user->recruiter->enterprise;
            $enterprise->logo_url = $logoUrl;
            $enterprise->save();

            return response()->json([
                'message' => 'Logo uploaded successfully',
                'logo_url' => $logoUrl
            ]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
