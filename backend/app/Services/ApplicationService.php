<?php

namespace App\Services;

use App\Models\Candidature;
use App\Models\User;
use App\Models\OffreEmploi;

class ApplicationService
{
    public function apply(User $user, OffreEmploi $offer, array $data): Candidature
    {
        return Candidature::create([
            'candidate_id' => $user->candidate->id,
            'offre_emploi_id' => $offer->id,
            'lettre_motivation' => $data['lettre_motivation'] ?? null,
            'etat_avancement' => 'En cours d\'examen',
            'date_postulation' => now()
        ]);
    }

    public function updateStatus(Candidature $application, string $status): Candidature
    {
        $application->update(['etat_avancement' => $status]);
        return $application;
    }
}