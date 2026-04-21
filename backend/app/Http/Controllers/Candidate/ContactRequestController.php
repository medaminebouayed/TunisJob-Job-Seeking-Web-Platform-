<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use Illuminate\Http\JsonResponse;

class ContactRequestController extends Controller
{
    /**
     * List all contact requests received by the candidate.
     */
    public function index(): JsonResponse
    {
        $candidate = auth()->user()->candidate;
        if (!$candidate) {
            return response()->json(['error' => 'Not a candidate'], 403);
        }

        $requests = ContactRequest::where('candidate_id', $candidate->id)
            ->with(['recruiter.enterprise', 'recruiter.user'])
            ->latest()
            ->get();

        return response()->json($requests);
    }
}
