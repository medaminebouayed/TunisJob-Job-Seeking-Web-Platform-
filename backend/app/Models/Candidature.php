<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Candidature extends Model
{
    use HasFactory;

    protected $table = 'candidatures';

    protected $fillable = [
        'offre_emploi_id',
        'candidate_id',
        'lettre_motivation',
        'etat_avancement',
        'date_postulation',
        'cv_envoye_url',
        'note_recruteur'
    ];

    protected $casts = [
        'date_postulation' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function offer()
    {
        return $this->belongsTo(OffreEmploi::class, 'offre_emploi_id');
    }
}
