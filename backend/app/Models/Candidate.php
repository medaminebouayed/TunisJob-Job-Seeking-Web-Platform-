<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'adresse',
        'titre_profil',
        'recherche_active',
        'prenom',
        'nom',
        'civilite',
        'url_photo_profil',
        'url_portfolio',
        'url_linkedin',
        'date_naissance'
    ];

    protected $casts = [
        'recherche_active' => 'boolean',
        'date_naissance' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function curriculumVitaes()
    {
        return $this->hasMany(CurriculumVitae::class);
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }

    public function favoritedJobs()
    {
        return $this->belongsToMany(OffreEmploi::class, 'favoris', 'candidate_id', 'offre_emploi_id')->withTimestamps();
    }
}