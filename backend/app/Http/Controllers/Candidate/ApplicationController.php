<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\OffreEmploi;
use App\Services\ApplicationService;
use App\Http\Requests\ApplyRequest;

class ApplicationController extends Controller
{
    public function __construct(private ApplicationService $service) {}

    public function store(ApplyRequest $request, OffreEmploi $offer)
    {
        $this->authorize('create', \App\Models\Candidature::class);

        $application = $this->service->apply(
            auth()->user(),
            $offer,
            $request->validated()
        );

        return response()->json($application);
    }
}