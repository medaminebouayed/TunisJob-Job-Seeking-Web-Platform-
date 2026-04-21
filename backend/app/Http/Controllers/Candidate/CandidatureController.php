<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidature;
use Illuminate\Support\Facades\Storage;

class CandidatureController extends Controller
{
    /**
     * Display a listing of the candidate's applications.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidat non trouvé'], 404);
        }

        // Fetch candidatures with offer and enterprise data
        $query = Candidature::with(['offer.enterprise', 'offer.localite'])
            ->where('candidate_id', $candidate->id)
            ->orderBy('date_postulation', 'desc');

        if ($request->query('paginate') === 'false') {
            return response()->json($query->get());
        }

        return response()->json($query->paginate(12));
    }

    /**
     * Store a newly created application.
     */
    public function store(Request $request)
    {
        $request->validate([
            'offre_emploi_id' => 'required|exists:offre_emplois,id',
            'lettre_motivation' => 'nullable|string',
            'cv_envoye_url' => 'nullable|string',
            'cv_file' => 'nullable|file|max:5120'
        ]);

        $user = auth()->user();
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidat non trouvé'], 404);
        }

        // Check if already applied
        $existing = Candidature::where('candidate_id', $candidate->id)
            ->where('offre_emploi_id', $request->offre_emploi_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 400);
        }

        $cvUrl = $request->cv_envoye_url;

        // If a physical file was uploaded instead of a link
        if ($request->hasFile('cv_file')) {
            $file = $request->file('cv_file');
            
            if (strtolower($file->getClientOriginalExtension()) !== 'pdf') {
                return response()->json(['message' => 'Le CV doit être un PDF valide.'], 422);
            }

            $filename = uniqid('app_cv_') . '_' . time() . '.pdf';
            // Bypass Laravel Storage/FlySystem entirely to avoid 'finfo' crash
            $file->move(public_path('storage/applications'), $filename);
            
            $cvUrl = 'applications/' . $filename;
        }

        $candidature = Candidature::create([
            'offre_emploi_id' => $request->offre_emploi_id,
            'candidate_id' => $candidate->id,
            'lettre_motivation' => $request->lettre_motivation,
            'etat_avancement' => 'En attente',
            'date_postulation' => now(),
            'cv_envoye_url' => $cvUrl
        ]);

        return response()->json([
            'message' => 'Candidature enregistrée avec succès',
            'candidature' => $candidature
        ]);
    }

    /**
     * Remove the specified application from storage.
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidat non trouvé'], 404);
        }

        $candidature = Candidature::where('id', $id)
            ->where('candidate_id', $candidate->id)
            ->first();

        if (!$candidature) {
            return response()->json(['message' => 'Candidature non trouvée ou non autorisée'], 404);
        }

        // Optional: Delete associate profile/cv files if they are application-specific
        // but for now we just delete the record
        $candidature->delete();

        return response()->json(['message' => 'Candidature annulée avec succès']);
    }
}
