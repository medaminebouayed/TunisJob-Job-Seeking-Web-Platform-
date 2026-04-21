<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = ['nom_spec', 'categorie_id'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categorie_id');
    }
}
