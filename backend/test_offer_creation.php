<?php

use App\Models\User;
use App\Models\OffreEmploi;
use App\Services\OfferService;

try {
    $user = User::where('role', 'recruiter')->first();
    if (!$user) {
        echo "No recruiter found\n";
        exit;
    }
    
    $service = new OfferService();
    $data = [
        'titre_poste' => 'Test Job',
        'description' => 'Test Description',
        'type_contrat' => 'Full time',
        'enterprise_id' => $user->recruiter->enterprise_id,
        'localite' => ['pays' => 'Tunisia', 'ville' => 'Sfax']
    ];
    
    $offer = $service->create($user, $data);
    echo "Success: Offer ID " . $offer->id . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}
