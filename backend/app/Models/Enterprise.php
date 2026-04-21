<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enterprise extends Model
{
    protected $fillable = [
        'nom_entreprise',
        'secteur_activite',
        'site_web',
        'ville_siege',
        'description',
        'siret_ou_matricule_fiscal',
        'logo_url',
        'banniere_url',
        'taille_effectif',
        'annee_creation',
        'adresse_siege'
    ];

    public function offers()
    {
        return $this->hasMany(OffreEmploi::class);
    }
}