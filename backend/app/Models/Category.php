<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['nom_categ'];

    public function specialties()
    {
        return $this->hasMany(Specialty::class, 'categorie_id');
    }
}
