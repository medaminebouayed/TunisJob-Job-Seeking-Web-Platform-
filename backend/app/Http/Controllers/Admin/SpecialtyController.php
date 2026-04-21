<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Specialty;
use Illuminate\Http\Request;

class SpecialtyController extends Controller
{
    public function index(Request $request)
    {
        $query = Specialty::with('category');

        if ($request->has('categorie_id')) {
            $query->where('categorie_id', $request->categorie_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_spec' => 'required|string|max:255|unique:specialties',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        $specialty = Specialty::create($validated);
        // Load category to return full object immediately
        $specialty->load('category');

        return response()->json($specialty, 201);
    }

    public function show(Specialty $specialty)
    {
        return response()->json($specialty->load('category'));
    }

    public function update(Request $request, Specialty $specialty)
    {
        $validated = $request->validate([
            'nom_spec' => 'required|string|max:255|unique:specialties,nom_spec,' . $specialty->id,
            'categorie_id' => 'required|exists:categories,id',
        ]);

        $specialty->update($validated);
        $specialty->load('category');
        return response()->json($specialty);
    }

    public function destroy(Specialty $specialty)
    {
        $specialty->delete();
        return response()->json(['message' => 'Spécialité supprimée avec succès']);
    }
}
