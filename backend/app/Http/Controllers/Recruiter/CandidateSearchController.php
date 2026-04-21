<?php

namespace App\Http\Controllers\Recruiter;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CandidateSearchController extends Controller
{
    /**
     * Search for candidates based on filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Candidate::with(['user', 'curriculumVitaes.competences'])
            ->where('recherche_active', true); // prioritizing active candidates

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('prenom', 'like', "%{$search}%")
                  ->orWhere('nom', 'like', "%{$search}%")
                  ->orWhere('titre_profil', 'like', "%{$search}%");
            });
        }

        if ($request->has('ville')) {
            $query->where('adresse', 'like', "%{$request->ville}%");
        }

        if ($request->has('skill')) {
            $skill = $request->skill;
            $query->whereHas('curriculumVitaes.competences', function($qs) use ($skill) {
                $qs->where('nom_competence', 'like', "%{$skill}%");
            });
        }

        $candidates = $query->latest()->paginate(12);

        $recruiter = auth()->user()->recruiter;
        if ($recruiter) {
            $candidates->getCollection()->transform(function($candidate) use ($recruiter) {
                $candidate->already_requested = ContactRequest::where('recruiter_id', $recruiter->id)
                    ->where('candidate_id', $candidate->id)
                    ->exists();
                return $candidate;
            });
        }

        return response()->json($candidates);
    }

    /**
     * Send a contact request / express interest in a candidate.
     */
    public function sendRequest(Request $request): JsonResponse
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'message' => 'nullable|string|max:1000'
        ]);

        $recruiter = auth()->user()->recruiter;
        if (!$recruiter) {
            return response()->json(['error' => 'Not a recruiter'], 403);
        }

        // Avoid duplicates
        $exists = ContactRequest::where('recruiter_id', $recruiter->id)
            ->where('candidate_id', $request->candidate_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Demand already sent'], 422);
        }

        $contactRequest = ContactRequest::create([
            'recruiter_id' => $recruiter->id,
            'candidate_id' => $request->candidate_id,
            'message' => $request->message,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Interest expressed successfully',
            'data' => $contactRequest
        ]);
    }

    /**
     * Get the full profile of a candidate for a recruiter (sourcing view).
     */
    public function showCandidateProfile(\App\Models\Candidate $candidate): JsonResponse
    {
        $recruiter = auth()->user()->recruiter;
        if (!$recruiter) {
            return response()->json(['error' => 'Not a recruiter'], 403);
        }

        $candidate->load(['user', 'curriculumVitaes.experiencesPro', 'curriculumVitaes.formations', 'curriculumVitaes.competences', 'curriculumVitaes.langues']);

        return response()->json([
            'candidate' => $candidate
        ]);
    }
}
