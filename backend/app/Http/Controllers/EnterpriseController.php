<?php

namespace App\Http\Controllers;

use App\Models\Enterprise;
use Illuminate\Http\Request;

class EnterpriseController extends Controller
{
    /**
     * Display a listing of all enterprises for public visitors/candidates.
     */
    public function index(Request $request)
    {
        $query = Enterprise::query();

        // Filter by city
        $query->when($request->ville, function ($q) use ($request) {
            return $q->where('ville_siege', 'like', '%' . $request->ville . '%');
        });

        // Filter by sector
        $query->when($request->secteur, function ($q) use ($request) {
            return $q->where('secteur_activite', 'like', '%' . $request->secteur . '%');
        });

        // Filter by size (effectif)
        $query->when($request->taille, function ($q) use ($request) {
            $range = explode('-', $request->taille);
            if (count($range) === 2) {
                return $q->whereBetween('taille_effectif', [$range[0], $range[1]]);
            } elseif ($request->taille === '500+') {
                return $q->where('taille_effectif', '>=', 500);
            }
            return $q;
        });

        // Sorting
        $sort = $request->get('sort', 'recent');
        $query->withCount(['offers' => function ($q) {
            $q->where('statut_moderation', 'Validée');
        }]);

        if ($sort === 'name') {
            $query->orderBy('nom_entreprise', 'asc');
        } elseif ($sort === 'size_desc') {
            $query->orderBy('taille_effectif', 'desc');
        } elseif ($sort === 'offers_count') {
            $query->orderBy('offers_count', 'desc');
        } else {
            $query->latest();
        }

        $perPage = (int) $request->get('per_page', 6);
        $perPage = max(1, min(50, $perPage));

        $enterprises = $query->paginate($perPage);

        return response()->json($enterprises);
    }

    /**
     * Display the specified enterprise with its active job offers.
     */
    public function show($id)
    {
        $enterprise = Enterprise::with(['offers' => function ($query) {
            $query->with('localite')->where('statut_moderation', 'Validée');
        }])->find($id);

        if (!$enterprise) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        return response()->json($enterprise);
    }
}
