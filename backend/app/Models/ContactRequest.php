<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    use HasFactory;

    protected $table = 'contact_requests';

    protected $fillable = [
        'recruiter_id',
        'candidate_id',
        'message',
        'status'
    ];

    public function recruiter()
    {
        return $this->belongsTo(Recruiter::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
