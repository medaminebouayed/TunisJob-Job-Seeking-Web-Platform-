<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OffreEmploi;

class FavoriController extends Controller
{
    /**
     * Get all favorited jobs for the authenticated candidate.
     */
    public function index()
    {
        $user = auth()->user();
        if (!$user || !$user->candidate) {
            return response()->json(['message' => 'Candidat non trouvé.'], 404);
        }

        $favorites = $user->candidate->favoritedJobs()->with(['enterprise', 'localite'])->get();

        return response()->json($favorites);
    }

    /**
     * Toggle a job in the candidate's favorites.
     */
    public function toggle(Request $request, $id)
    {
        $user = auth()->user();
        if (!$user || !$user->candidate) {
            return response()->json(['message' => 'Candidat non trouvé.'], 404);
        }

        $offer = OffreEmploi::findOrFail($id);
        
        $candidate = $user->candidate;
        $isFavorited = $candidate->favoritedJobs()->where('offre_emploi_id', $offer->id)->exists();

        if ($isFavorited) {
            $candidate->favoritedJobs()->detach($offer->id);
            return response()->json(['message' => 'Offre retirée des favoris.', 'isFavorited' => false]);
        } else {
            $candidate->favoritedJobs()->attach($offer->id);
            return response()->json(['message' => 'Offre ajoutée aux favoris.', 'isFavorited' => true]);
        }
    }
}
