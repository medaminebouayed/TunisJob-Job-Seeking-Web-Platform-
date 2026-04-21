<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OffreEmploi;
use Illuminate\Http\Request;

class OfferAdminController extends Controller
{
    public function index()
    {
        // Load offers with enterprise details
        $offers = OffreEmploi::with(['enterprise'])->latest()->get();
        return response()->json($offers);
    }

    public function destroy(OffreEmploi $offer)
    {
        $offer->delete();
        return response()->json(['message' => 'Offre supprimée avec succès']);
    }
}
