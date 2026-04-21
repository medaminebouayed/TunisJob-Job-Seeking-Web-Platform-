<?php

namespace App\Http\Controllers\Recruiter;

use App\Http\Controllers\Controller;
use App\Models\OffreEmploi;
use App\Models\Candidature;
use App\Services\OfferService;
use App\Http\Requests\StoreOfferRequest;
use App\Http\Requests\UpdateOfferRequest;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function __construct(private OfferService $service) {}

    /**
     * Get all offers for the currently authenticated recruiter.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->recruiter) {
            return response()->json(['error' => 'Not a recruiter'], 403);
        }

        $query = OffreEmploi::where('recruiter_id', $user->recruiter->id)
            ->with(['entreprise', 'applications', 'specialty.category']);

        // Search by title
        if ($request->has('search')) {
            $query->where('titre_poste', 'like', '%' . $request->get('search') . '%');
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('statut_moderation', $request->get('status'));
        }

        // Filter by Category
        if ($request->has('categorie_id')) {
            $query->whereHas('specialty', function($q) use ($request) {
                $q->where('categorie_id', $request->get('categorie_id'));
            });
        }

        // Filter by Specialty
        if ($request->has('specialty_id')) {
            $query->where('specialty_id', $request->get('specialty_id'));
        }

        $offers = $query->latest()->get();

        return response()->json($offers);
    }

    public function show(OffreEmploi $offer)
    {
        // Simple authorization check
        if ($offer->recruiter_id !== auth()->user()->recruiter->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($offer->load([
            'entreprise', 
            'applications.candidate',
            'localite',
            'specialty.category',
            'languages',
            'competencies'
        ]));
    }

    public function store(StoreOfferRequest $request)
    {
        $offer = $this->service->create(auth()->user(), $request->validated());
        return response()->json($offer);
    }

    public function update(UpdateOfferRequest $request, OffreEmploi $offer)
    {
        if ($offer->recruiter_id !== auth()->user()->recruiter->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $offer = $this->service->update($offer, $request->validated());
        return response()->json($offer);
    }

    public function destroy(OffreEmploi $offer)
    {
        if ($offer->recruiter_id !== auth()->user()->recruiter->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $this->service->delete($offer);
        return response()->json(['message' => 'Deleted']);
    }

    /**
     * Update the status of an application for a recruiter's offer.
     */
    public function updateApplicationStatus(Request $request, Candidature $candidature)
    {
        $offer = $candidature->offer;
        $recruiter = auth()->user()->recruiter;

        if (!$recruiter || $offer->recruiter_id !== $recruiter->id) {
            return response()->json(['error' => 'Unauthorized or missing recruiter profile'], 403);
        }

        $request->validate(['etat_avancement' => 'required|string']);
        $candidature->update(['etat_avancement' => $request->etat_avancement]);

        return response()->json($candidature);
    }

    /**
     * Update the recruiter's private note on an application.
     */
    public function updateApplicationNote(Request $request, Candidature $candidature)
    {
        $offer = $candidature->offer;
        $recruiter = auth()->user()->recruiter;

        if (!$recruiter || $offer->recruiter_id !== $recruiter->id) {
            return response()->json(['error' => 'Unauthorized or missing recruiter profile'], 403);
        }

        $request->validate(['note_recruteur' => 'nullable|string']);
        
        // Ensure we are updating the correct field that exists in DB
        $candidature->update(['note_recruteur' => $request->note_recruteur]);

        return response()->json([
            'success' => true,
            'note_recruteur' => $candidature->note_recruteur
        ]);
    }

    /**
     * Get the full profile of a candidate who applied to the recruiter's offer.
     */
    public function getCandidateProfile(\App\Models\Candidature $candidature)
    {
        $offer = $candidature->offer;
        $recruiter = auth()->user()->recruiter;

        if (!$recruiter || $offer->recruiter_id !== $recruiter->id) {
            return response()->json(['error' => 'Unauthorized or not a recruiter'], 403);
        }

        $candidate = $candidature->candidate->load(['user', 'curriculumVitaes.experiencesPro', 'curriculumVitaes.formations', 'curriculumVitaes.competences', 'curriculumVitaes.langues']);

        // Flatten pivot data for frontend consistency
        if ($candidate->curriculumVitaes) {
            foreach ($candidate->curriculumVitaes as $cv) {
                $cv->competences->map(function ($comp) {
                    $comp->niveau_maitrise = $comp->pivot->niveau_maitrise;
                    return $comp;
                });
                $cv->langues->map(function ($langue) {
                    $langue->niveau_lu = $langue->pivot->niveau_lu;
                    $langue->niveau_ecrit = $langue->pivot->niveau_ecrit;
                    $langue->niveau_parle = $langue->pivot->niveau_parle;
                    return $langue;
                });
            }
        }

        return response()->json([
            'candidature' => $candidature,
            'candidate' => $candidate
        ]);
    }
}