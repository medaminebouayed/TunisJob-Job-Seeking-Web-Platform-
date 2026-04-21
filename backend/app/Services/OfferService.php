<?php

namespace App\Services;

use App\Models\OffreEmploi;
use App\Models\User;

class OfferService
{
    public function create(User $user, array $data): OffreEmploi
    {
        // Safety check for recruiter profile
        if (!$user->recruiter) {
            throw new \Exception("Profil de recruteur manquant pour cet utilisateur (ID: {$user->id}).");
        }

        $localite = null;
        if (!empty($data['localite'])) {
            $localite = \App\Models\LocaliteOffre::create($data['localite']);
        }

        $offerData = collect($data)->except(['localite', 'languages', 'competencies'])->toArray();
        
        // Ensure enterprise_id is populated from either request or profile
        $enterpriseId = $data['enterprise_id'] ?? $user->recruiter->enterprise_id;
        
        if (!$enterpriseId) {
            throw new \Exception("Identifiant de l'entreprise manquant pour ce recruteur.");
        }

        try {
            $offer = OffreEmploi::create([
                ...$offerData,
                'recruiter_id' => $user->recruiter->id,
                'enterprise_id' => $enterpriseId,
                'localite_offre_id' => $localite?->id,
                'statut_moderation' => 'Validée',
                'statut_offre' => $data['statut_offre'] ?? 'Ouverte',
                'date_publication' => now()->format('Y-m-d H:i:s'),
                'date_expiration' => isset($data['date_expiration']) ? \Carbon\Carbon::parse($data['date_expiration'])->format('Y-m-d H:i:s') : null,
            ]);

            $this->syncRequirements($offer, $data);

            return $offer;
        } catch (\Exception $e) {
            \Log::error("Erreur lors de la création de l'offre d'emploi: " . $e->getMessage(), [
                'user_id' => $user->id,
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function update(OffreEmploi $offer, array $data): OffreEmploi
    {
        // Safety check
        if (auth()->user()->id !== $offer->recruiter->user_id) {
            throw new \Exception("Autorisation refusée pour modifier cette offre.");
        }

        if (!empty($data['localite'])) {
            if ($offer->localite) {
                $offer->localite->update($data['localite']);
            } else {
                $localite = \App\Models\LocaliteOffre::create($data['localite']);
                $offer->update(['localite_offre_id' => $localite->id]);
            }
        }

        $offerData = collect($data)->except(['localite', 'languages', 'competencies'])->toArray();
        if (isset($offerData['date_expiration'])) {
            $offerData['date_expiration'] = \Carbon\Carbon::parse($offerData['date_expiration'])->format('Y-m-d H:i:s');
        }
        $offer->update($offerData);
        
        $this->syncRequirements($offer, $data);

        return $offer;
    }

    private function syncRequirements(OffreEmploi $offer, array $data): void
    {
        if (isset($data['languages'])) {
            $langs = [];
            foreach ($data['languages'] as $lang) {
                $langId = $lang['id'] ?? null;
                if (!$langId && isset($lang['nom_langue'])) {
                    $langModel = \App\Models\Langue::firstOrCreate(
                        ['nom_langue' => trim($lang['nom_langue'])]
                    );
                    $langId = $langModel->id;
                }
                
                if ($langId) {
                    $langs[$langId] = ['niveau_requis' => $lang['niveau_requis'] ?? 'Intermediate'];
                }
            }
            $offer->languages()->sync($langs);
        }

        if (isset($data['competencies'])) {
            $comps = [];
            foreach ($data['competencies'] as $comp) {
                $compId = $comp['id'] ?? null;
                if (!$compId && isset($comp['nom_competence'])) {
                    // Find or create by name
                    $competence = \App\Models\Competence::firstOrCreate(
                        ['nom_competence' => $comp['nom_competence']]
                    );
                    $compId = $competence->id;
                }
                
                if ($compId) {
                    $comps[$compId] = ['niveau_requis' => $comp['niveau_requis'] ?? 'Intermediate'];
                }
            }
            $offer->competencies()->sync($comps);
        }
    }

    public function delete(OffreEmploi $offer): void
    {
        if ($offer->localite) {
            $offer->localite->delete();
        }
        $offer->delete();
    }

    public function approve(OffreEmploi $offer): OffreEmploi
    {
        $offer->update(['statut_moderation' => 'Validée']);
        return $offer;
    }
}