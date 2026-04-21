<?php

namespace App\Http\Controllers;

use App\Models\OffreEmploi;
use Illuminate\Http\JsonResponse;

class PublicOfferController extends Controller
{
    /**
     * Get all approved job offers for the public listing.
     */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $query = OffreEmploi::with(['entreprise', 'localite', 'specialty.category', 'competencies'])
            ->where('statut_moderation', 'Validée');

        // Filtering by search term (title or company)
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('titre_poste', 'like', "%{$search}%")
                  ->orWhereHas('entreprise', function($qe) use ($search) {
                      $qe->where('nom_entreprise', 'like', "%{$search}%");
                  });
            });
        }

        // Filtering by type
        if ($request->filled('type_contrat')) {
            $query->where('type_contrat', trim($request->get('type_contrat')));
        }

        // Salary range
        if ($request->filled('salaire_min')) {
            $query->where('salaire_min', '>=', $request->get('salaire_min'));
        }
        if ($request->filled('salaire_max')) {
            $query->where('salaire_max', '<=', $request->get('salaire_max'));
        }

        // Location (City)
        if ($request->filled('ville')) {
            $ville = $request->get('ville');
            $query->whereHas('localite', function($ql) use ($ville) {
                $ql->where('ville', 'like', "%{$ville}%");
            });
        }

        // Category/Specialty
        if ($request->filled('categorie_id')) {
            $query->whereHas('specialty', function($qs) use ($request) {
                $qs->where('categorie_id', $request->get('categorie_id'));
            });
        }
        if ($request->filled('specialty_id')) {
            $query->where('specialty_id', $request->get('specialty_id'));
        }

        // Skills
        if ($request->filled('skill')) {
            $skill = $request->get('skill');
            $query->whereHas('competencies', function($qc) use ($skill) {
                $qc->where('nom_competence', 'like', "%{$skill}%");
            });
        }

        $offers = $query->get();
        $candidate = auth('sanctum')->check() ? auth('sanctum')->user()->candidate : null;
        $sort = $request->get('sort', $candidate ? 'relevance' : 'recent');

        if ($candidate) {
            $primaryCv = $candidate->curriculumVitaes()->where('est_principal', true)->first();
            $candidateSkills = $primaryCv ? $primaryCv->competences->pluck('id')->toArray() : [];
            $candidateTitle = strtolower($candidate->titre_profil ?? '');

            $offers = $offers->map(function ($offer) use ($candidateSkills, $candidateTitle) {
                // ... matching logic stays here
                $score = 0;
                $offerSkills = $offer->competencies->pluck('id')->toArray();
                if (count($offerSkills) > 0) {
                    $intersect = array_intersect($candidateSkills, $offerSkills);
                    $skillScore = (count($intersect) / count($offerSkills)) * 100;
                    $score += $skillScore * 0.8;
                } else {
                    $score += 80;
                }
                $offerTitle = strtolower($offer->titre_poste ?? '');
                if ($candidateTitle && $offerTitle) {
                    if (str_contains($offerTitle, $candidateTitle) || str_contains($candidateTitle, $offerTitle)) {
                        $score += 20;
                    } else {
                        $candidateWords = explode(' ', $candidateTitle);
                        $offerWords = explode(' ', $offerTitle);
                        $commonWords = array_intersect($candidateWords, $offerWords);
                        if (count($commonWords) > 0) $score += 10;
                    }
                } else {
                    $score += 10;
                }

                $offer->match_score = round($score);
                return $offer;
            });
        }

        // Apply chosen sort
        if ($sort === 'salary_desc') {
            $offers = $offers->sortByDesc('salaire_max');
        } elseif ($sort === 'recent') {
            $offers = $offers->sortByDesc('created_at');
        } elseif ($sort === 'relevance' && $candidate) {
            $offers = $offers->sortByDesc('match_score');
        } else {
            // Default fallback
            $offers = $offers->sortByDesc('created_at');
        }

        $offers = $offers->values();

        // Manual Pagination for the collection
        $currentPage = \Illuminate\Pagination\Paginator::resolveCurrentPage() ?: 1;
        $perPage = (int) $request->get('per_page', 6);
        $perPage = max(1, min(50, $perPage));
        $pagedOffers = new \Illuminate\Pagination\LengthAwarePaginator(
            $offers->forPage($currentPage, $perPage)->values(),
            $offers->count(),
            $perPage,
            $currentPage,
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );

        return response()->json($pagedOffers);
    }

    /**
     * Get a single job offer by ID for the public detail page.
     */
    public function show(int $id): JsonResponse
    {
        $offer = OffreEmploi::with([
            'entreprise', 
            'localite', 
            'specialty.category', 
            'languages', 
            'competencies'
        ])
        ->where('statut_moderation', 'Validée')
        ->findOrFail($id);

        return response()->json($offer);
    }
}
