<?php

namespace App\Policies;

use App\Models\User;
use App\Models\OffreEmploi;

class OfferPolicy
{
    // Recruiter can create
    public function create(User $user): bool
    {
        return $user->isRecruiter();
    }

    // Recruiter can update ONLY his offer
    public function update(User $user, OffreEmploi $offer): bool
    {
        return $user->isRecruiter() &&
               $offer->recruiter_id === $user->recruiter?->id;
    }

    // Recruiter can delete ONLY his offer
    public function delete(User $user, OffreEmploi $offer): bool
    {
        return $user->isRecruiter() &&
               $offer->recruiter_id === $user->recruiter?->id;
    }

    // ONLY ADMIN can approve
    public function approve(User $user): bool
    {
        return $user->isAdmin();
    }
}