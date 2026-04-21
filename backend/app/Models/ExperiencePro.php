<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExperiencePro extends Model
{
    use HasFactory;

    protected $table = 'experiences_pro';

    protected $fillable = [
        'curriculum_vitae_id',
        'titre_poste',
        'nom_employeur',
        'lieu',
        'date_debut',
        'date_fin',
        'poste_actuelle',
        'description'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'poste_actuelle' => 'boolean',
    ];

    public function curriculumVitae()
    {
        return $this->belongsTo(CurriculumVitae::class);
    }
}
