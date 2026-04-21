<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Application;

class ApplicationPolicy
{
    public function create(User $user): bool
    {
        return $user->isCandidate();
    }

    public function update(User $user, Application $application): bool
    {
        return $user->isRecruiter();
    }
}