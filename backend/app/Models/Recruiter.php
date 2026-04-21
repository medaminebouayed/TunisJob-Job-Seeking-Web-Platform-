<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recruiter extends Model
{
    protected $fillable = [
        'user_id',
        'enterprise_id',
        'fonction_entreprise',
        'telephone_pro',
        'est_verifie'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enterprise()
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function offers()
    {
        return $this->hasMany(OffreEmploi::class, 'recruiter_id');
    }
}