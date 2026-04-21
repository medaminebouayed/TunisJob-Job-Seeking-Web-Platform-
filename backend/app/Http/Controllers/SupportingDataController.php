<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Specialty;
use App\Models\Langue;
use App\Models\Competence;
use Illuminate\Http\Request;

class SupportingDataController extends Controller
{
    public function categories()
    {
        return response()->json(Category::with('specialties')->get());
    }

    public function specialties()
    {
        return response()->json(Specialty::all());
    }

    public function languages()
    {
        return response()->json(Langue::all());
    }

    public function skills()
    {
        return response()->json(Competence::all());
    }
}
