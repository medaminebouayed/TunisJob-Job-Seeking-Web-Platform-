<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOfferRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titre_poste' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'profil_recherche' => 'nullable|string',
            'proposition_avantages' => 'nullable|string',
            'type_contrat' => 'sometimes|required|string',
            'niveau_etude_requis' => 'nullable|string',
            'experience_requise' => 'nullable|string',
            'salaire_min' => 'nullable|numeric',
            'salaire_max' => 'nullable|numeric',
            'devise' => 'nullable|string',
            'frequence_salaire' => 'nullable|string',
            'nombre_poste_pourvoir' => 'nullable|integer',
            'date_expiration' => 'nullable',
            'statut_offre' => 'nullable|string',
            'enterprise_id' => 'sometimes|nullable|exists:enterprises,id',
            'specialty_id' => 'sometimes|nullable|exists:specialties,id',
            
            // Nested location
            'localite' => 'nullable|array',
            'localite.id' => 'nullable|exists:localite_offres,id',
            'localite.pays' => 'nullable|string',
            'localite.gouvernorat' => 'nullable|string',
            'localite.ville' => 'nullable|string',
            'localite.code_postal' => 'nullable|string',

            // Relationships
            'languages' => 'nullable|array',
            'languages.*.id' => 'nullable|exists:langues,id',
            'languages.*.nom_langue' => 'nullable|string',
            'languages.*.niveau_requis' => 'nullable|string',
            
            'competencies' => 'nullable|array',
            'competencies.*.id' => 'nullable|exists:competences,id',
            'competencies.*.nom_competence' => 'nullable|string',
            'competencies.*.niveau_requis' => 'nullable|string',
        ];
    }
}
