<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enterprise;
use Illuminate\Http\Request;

class EnterpriseAdminController extends Controller
{
    public function index()
    {
        // Load enterprises, perhaps with count of their offers
        $enterprises = Enterprise::withCount('offers')->latest()->get();
        return response()->json($enterprises);
    }

    public function destroy(Enterprise $enterprise)
    {
        $enterprise->delete();
        return response()->json(['message' => 'Entreprise supprimée avec succès']);
    }
}
