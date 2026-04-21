<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enterprise;
use App\Models\OffreEmploi;
use App\Models\User;
use App\Models\Candidature;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalEnterprises = Enterprise::count();
        $totalOffers = OffreEmploi::where('statut_moderation', 'Validée')->count();
        $totalCandidates = User::where('role', 'Candidate')->count();
        $totalApplications = Candidature::count();

        // Get 5 latest candidates with their profiles
        $latestCandidates = User::where('role', 'Candidate')
            ->with('candidate')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_enterprises' => $totalEnterprises,
            'total_offers' => $totalOffers,
            'total_candidates' => $totalCandidates,
            'total_applications' => $totalApplications,
            'latest_candidates' => $latestCandidates
        ]);
    }
}
