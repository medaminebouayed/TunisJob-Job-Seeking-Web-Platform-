<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Competence extends Model
{
    use HasFactory;

    protected $fillable = ['nom_competence'];

    public function curriculumVitaes()
    {
        return $this->belongsToMany(CurriculumVitae::class, 'curriculum_vitae_competence')
                    ->withPivot('niveau_maitrise')
                    ->withTimestamps();
    }
}
