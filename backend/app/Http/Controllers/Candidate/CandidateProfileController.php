<?php
 
 namespace App\Http\Controllers\Candidate;
 
 use App\Http\Controllers\Controller;
 use Illuminate\Http\Request;
 use App\Models\Candidate;
 use Illuminate\Support\Facades\Storage;
 
 class CandidateProfileController extends Controller
 {
     public function show()
     {
         $user = auth()->user();
         $candidate = $user->candidate;
         
         if (!$candidate) {
             return response()->json(['message' => 'Candidate profile not found'], 404);
         }
 
         return response()->json([
             'user' => $user,
             'candidate' => $candidate
         ]);
     }
 
     public function update(Request $request)
     {
         $user = auth()->user();
         $candidate = $user->candidate;
 
         if (!$candidate) {
             return response()->json(['message' => 'Candidate profile not found'], 404);
         }
 
         $validated = $request->validate([
             'prenom' => 'nullable|string|max:255',
             'nom' => 'nullable|string|max:255',
             'civilite' => 'nullable|string|max:255',
             'phone' => 'nullable|string|max:255',
             'adresse' => 'nullable|string|max:255',
             'titre_profil' => 'nullable|string|max:255',
             'url_portfolio' => 'nullable|string|max:255',
             'url_linkedin' => 'nullable|string|max:255',
             'date_naissance' => 'nullable|date',
             'recherche_active' => 'nullable|boolean',
             'email' => 'nullable|email|max:255|unique:users,email,'.$user->id,
         ]);
 
         if ($request->has('email') && $request->email !== $user->email) {
             $user->update(['email' => $request->email]);
         }
 
         $candidate->update($request->only([
             'prenom', 'nom', 'civilite', 'phone', 'adresse', 
             'titre_profil', 'url_portfolio', 'url_linkedin', 
             'date_naissance', 'recherche_active'
         ]));
 
         return response()->json([
             'message' => 'Profile updated successfully',
             'candidate' => $candidate->load('user'),
         ]);
     }
 
     public function uploadPhoto(Request $request)
     {
         // Verify if file reached PHP
         if (!$request->hasFile('photo')) {
            $maxSize = ini_get('upload_max_filesize');
            return response()->json([
                'message' => "Le fichier n'a pas atteint le serveur ou dépasse la limite PHP ($maxSize). Essayez un fichier plus petit (< 2Mo).",
                'files_present' => array_keys($request->allFiles()),
            ], 422);
         }

         $request->validate([
             'photo' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:5120',
         ]);
 
         $user = auth()->user();
         $candidate = $user->candidate;
 
         if (!$candidate) {
             return response()->json(['message' => 'Candidate profile not found'], 404);
         }
 
         if ($request->hasFile('photo')) {
             if ($candidate->url_photo_profil) {
                if (str_starts_with($candidate->url_photo_profil, 'profiles/')) {
                    Storage::disk('public')->delete($candidate->url_photo_profil);
                }
             }
 
             $filename = uniqid('photo_') . '_' . time() . '.' . strtolower($request->file('photo')->getClientOriginalExtension());
             
             // Bypass Laravel Storage/FlySystem entirely to avoid 'finfo' crash
             $request->file('photo')->move(public_path('storage/profiles'), $filename);
             
             $path = 'profiles/' . $filename;
             $candidate->update(['url_photo_profil' => $path]);
 
             return response()->json([
                 'message' => 'Photo uploaded successfully',
                 'url_photo_profil' => $path
             ]);
         }
 
         return response()->json(['message' => 'File not found'], 400);
     }
 }
