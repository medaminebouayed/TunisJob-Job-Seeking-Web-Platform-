<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CurriculumVitae extends Model
{
    use HasFactory;

    protected $table = 'curriculum_vitaes';

    protected $fillable = [
        'candidate_id',
        'titre_cv',
        'synthese_profil',
        'fichier_pdf',
        'est_principal',
        'est_visible',
        'dernier_maj'
    ];

    protected $casts = [
        'est_principal' => 'boolean',
        'est_visible' => 'boolean',
        'dernier_maj' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function experiencesPro()
    {
        return $this->hasMany(ExperiencePro::class);
    }

    public function formations()
    {
        return $this->hasMany(Formation::class);
    }

    public function competences()
    {
        return $this->belongsToMany(Competence::class, 'curriculum_vitae_competence')
                    ->withPivot('niveau_maitrise')
                    ->withTimestamps();
    }

    public function langues()
    {
        return $this->belongsToMany(Langue::class, 'curriculum_vitae_langue')
                    ->withPivot(['niveau_lu', 'niveau_ecrit', 'niveau_parle'])
                    ->withTimestamps();
    }
}
