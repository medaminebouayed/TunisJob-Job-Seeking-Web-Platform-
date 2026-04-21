<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OffreEmploi extends Model
{
    use SoftDeletes;

    protected $table = 'offre_emplois';

    protected $fillable = [
        'reference_offre',
        'recruiter_id',
        'enterprise_id',
        'titre_poste',
        'description',
        'profil_recherche',
        'proposition_avantages',
        'type_contrat',
        'niveau_etude_requis',
        'experience_requise',
        'salaire_min',
        'salaire_max',
        'devise',
        'frequence_salaire',
        'est_anonyme',
        'nombre_poste_pourvoir',
        'date_publication',
        'date_expiration',
        'statut_offre',
        'statut_moderation',
        'specialty_id',
        'localite_offre_id'
    ];

    public function recruiter()
    {
        return $this->belongsTo(Recruiter::class);
    }

    public function entreprise()
    {
        return $this->belongsTo(Enterprise::class, 'enterprise_id');
    }

    public function enterprise()
    {
        return $this->belongsTo(Enterprise::class, 'enterprise_id');
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class);
    }

    public function localite()
    {
        return $this->belongsTo(LocaliteOffre::class, 'localite_offre_id');
    }

    public function languages()
    {
        return $this->belongsToMany(Langue::class, 'offre_emploi_langue')
            ->withPivot('niveau_requis')
            ->withTimestamps();
    }

    public function competencies()
    {
        return $this->belongsToMany(Competence::class, 'offre_emploi_competence')
            ->withPivot('niveau_requis')
            ->withTimestamps();
    }

    public function applications()
    {
        return $this->hasMany(Candidature::class, 'offre_emploi_id');
    }
}