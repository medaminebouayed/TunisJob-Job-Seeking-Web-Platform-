<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'curriculum_vitae_id',
        'nom_diplome',
        'etablissement',
        'date_debut',
        'date_fin',
        'niveau_acquis',
        'details'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function curriculumVitae()
    {
        return $this->belongsTo(CurriculumVitae::class);
    }
}
