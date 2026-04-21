<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OffreEmploi;
use App\Services\OfferService;

class OfferModerationController extends Controller
{
    public function __construct(private OfferService $service) {}

    public function approve(OffreEmploi $offer)
    {
        $offer = $this->service->approve($offer);
        return response()->json($offer);
    }

    public function updateStatus(\Illuminate\Http\Request $request, OffreEmploi $offer)
    {
        $request->validate([
            'status' => 'required|string|in:Validée,Rejetée,Pendante'
        ]);

        $offer->update(['statut_moderation' => $request->status]);

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'offer' => $offer
        ]);
    }
}