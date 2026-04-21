<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Langue extends Model
{
    use HasFactory;

    protected $fillable = ['nom_langue'];

    public function curriculumVitaes()
    {
        return $this->belongsToMany(CurriculumVitae::class, 'curriculum_vitae_langue')
                    ->withPivot(['niveau_lu', 'niveau_ecrit', 'niveau_parle'])
                    ->withTimestamps();
    }
}
