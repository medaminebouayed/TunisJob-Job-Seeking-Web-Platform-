<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CurriculumVitae;
use App\Models\Competence;
use App\Models\Langue;
use Illuminate\Support\Facades\Storage;

class CvController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $cv = CurriculumVitae::firstOrCreate(
            ['candidate_id' => $candidate->id],
            ['titre_cv' => 'Mon CV', 'est_principal' => true]
        );

        $cv->load(['experiencesPro', 'formations', 'competences', 'langues']);

        $cvArray = $cv->toArray();
        
        $cvArray['competences'] = $cv->competences->map(function ($comp) {
            $arr = $comp->toArray();
            $arr['niveau_maitrise'] = $comp->pivot->niveau_maitrise;
            unset($arr['pivot']);
            return $arr;
        });

        $cvArray['langues'] = $cv->langues->map(function ($langue) {
            $arr = $langue->toArray();
            $arr['niveau_lu'] = $langue->pivot->niveau_lu;
            $arr['niveau_ecrit'] = $langue->pivot->niveau_ecrit;
            $arr['niveau_parle'] = $langue->pivot->niveau_parle;
            unset($arr['pivot']);
            return $arr;
        });

        return response()->json($cvArray);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $cv = CurriculumVitae::firstOrCreate(
            ['candidate_id' => $candidate->id],
            ['titre_cv' => 'Mon CV']
        );

        // Update basic CV fields
        if ($request->has('titre_cv') || $request->has('synthese_profil')) {
            $cv->update($request->only(['titre_cv', 'synthese_profil']));
        }

        // Experiences
        if (isset($request->experiences_pro) && is_array($request->experiences_pro)) {
            $cv->experiencesPro()->delete(); 
            foreach ($request->experiences_pro as $exp) {
                if (empty($exp['titre_poste']) && empty($exp['nom_employeur'])) continue;
                $cv->experiencesPro()->create([
                    'titre_poste' => $exp['titre_poste'] ?? '',
                    'nom_employeur' => $exp['nom_employeur'] ?? '',
                    'ville_pays' => $exp['ville_pays'] ?? null,
                    'date_debut' => !empty($exp['date_debut']) ? $exp['date_debut'] : null,
                    'date_fin' => !empty($exp['date_fin']) ? $exp['date_fin'] : null,
                    'poste_actuelle' => $exp['poste_actuelle'] ?? false,
                    'description' => $exp['description'] ?? null,
                ]);
            }
        }

        // Formations
        if (isset($request->formations) && is_array($request->formations)) {
            $cv->formations()->delete();
            foreach ($request->formations as $form) {
                if (empty($form['nom_diplome']) && empty($form['etablissement'])) continue;
                $cv->formations()->create([
                    'nom_diplome' => $form['nom_diplome'] ?? '',
                    'etablissement' => $form['etablissement'] ?? '',
                    'ville_pays' => $form['ville_pays'] ?? null,
                    'date_debut' => !empty($form['date_debut']) ? $form['date_debut'] : null,
                    'date_fin' => !empty($form['date_fin']) ? $form['date_fin'] : null,
                    'description' => $form['description'] ?? null,
                ]);
            }
        }

        // Competences
        if (isset($request->competences) && is_array($request->competences)) {
            $competenceSync = [];
            foreach ($request->competences as $comp) {
                if (empty($comp['nom_competence'])) continue;
                $model = Competence::firstOrCreate(['nom_competence' => trim($comp['nom_competence'])]);
                $competenceSync[$model->id] = ['niveau_maitrise' => $comp['niveau_maitrise'] ?? null];
            }
            $cv->competences()->sync($competenceSync);
        }

        // Langues
        if (isset($request->langues) && is_array($request->langues)) {
            $langueSync = [];
            foreach ($request->langues as $langue) {
                if (empty($langue['nom_langue'])) continue;
                $model = Langue::firstOrCreate(['nom_langue' => trim($langue['nom_langue'])]);
                $langueSync[$model->id] = [
                    'niveau_lu' => $langue['niveau_lu'] ?? 'Débutant',
                    'niveau_ecrit' => $langue['niveau_ecrit'] ?? 'Débutant',
                    'niveau_parle' => $langue['niveau_parle'] ?? 'Débutant'
                ];
            }
            $cv->langues()->sync($langueSync);
        }

        // Reload fresh data to return
        $cv->load(['experiencesPro', 'formations', 'competences', 'langues']);

        $cvArray = $cv->toArray();
        
        $cvArray['competences'] = $cv->competences->map(function ($comp) {
            $arr = $comp->toArray();
            $arr['niveau_maitrise'] = $comp->pivot->niveau_maitrise;
            unset($arr['pivot']);
            return $arr;
        });

        $cvArray['langues'] = $cv->langues->map(function ($langue) {
            $arr = $langue->toArray();
            $arr['niveau_lu'] = $langue->pivot->niveau_lu;
            $arr['niveau_ecrit'] = $langue->pivot->niveau_ecrit;
            $arr['niveau_parle'] = $langue->pivot->niveau_parle;
            unset($arr['pivot']);
            return $arr;
        });

        return response()->json($cvArray);
    }

    public function uploadPdf(Request $request)
    {
        $request->validate([
            'cv_pdf' => 'required|file|max:5120',
        ]);

        $file = $request->file('cv_pdf');
        
        if (strtolower($file->getClientOriginalExtension()) !== 'pdf') {
            return response()->json(['message' => 'Le fichier doit être un PDF valide.'], 422);
        }

        $user = auth()->user();
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $cv = CurriculumVitae::firstOrCreate(
            ['candidate_id' => $candidate->id],
            ['titre_cv' => 'Mon CV', 'est_principal' => true]
        );

        if ($request->hasFile('cv_pdf')) {
            if ($cv->fichier_pdf) {
                Storage::disk('public')->delete($cv->fichier_pdf);
            }

            $filename = uniqid('cv_') . '_' . time() . '.pdf';
            
            // Use storage_path to ensure it goes to the linked storage/app/public
            $request->file('cv_pdf')->move(storage_path('app/public/cvs'), $filename);
            
            $path = 'cvs/' . $filename;
            $cv->update(['fichier_pdf' => $path]);

            return response()->json([
                'message' => 'CV PDF uploaded successfully',
                'fichier_pdf' => $path
            ]);
        }

        return response()->json(['message' => 'File not found'], 400);
    }

    public function deletePdf()
    {
        $user = auth()->user();
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $cv = CurriculumVitae::where('candidate_id', $candidate->id)->first();

        if (!$cv || !$cv->fichier_pdf) {
            return response()->json(['message' => 'CV PDF not found'], 404);
        }

        if ($cv->fichier_pdf) {
            // Delete physical file
            Storage::disk('public')->delete($cv->fichier_pdf);
            $cv->update(['fichier_pdf' => null]);
        }

        return response()->json(['message' => 'CV PDF deleted successfully']);
    }
}
