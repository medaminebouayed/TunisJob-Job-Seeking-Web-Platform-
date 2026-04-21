<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocaliteOffre extends Model
{
    protected $table = 'localite_offres';

    protected $fillable = [
        'pays',
        'gouvernorat',
        'ville',
        'code_postal'
    ];

    public function offers()
    {
        return $this->hasMany(OffreEmploi::class, 'localite_offre_id');
    }
}
