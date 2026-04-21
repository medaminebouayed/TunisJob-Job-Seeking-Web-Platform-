<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('enterprises', function (Blueprint $table) {
            $table->renameColumn('name', 'nom_entreprise');
            $table->renameColumn('sector', 'secteur_activite');
            $table->renameColumn('website', 'site_web');
            $table->renameColumn('city', 'ville_siege');
            
            $table->text('description')->nullable();
            $table->string('siret_ou_matricule_fiscal')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('banniere_url')->nullable();
            $table->integer('taille_effectif')->nullable();
            $table->integer('annee_creation')->nullable();
            $table->string('adresse_siege')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enterprises', function (Blueprint $table) {
            $table->renameColumn('nom_entreprise', 'name');
            $table->renameColumn('secteur_activite', 'sector');
            $table->renameColumn('site_web', 'website');
            $table->renameColumn('ville_siege', 'city');
            
            $table->dropColumn([
                'description',
                'siret_ou_matricule_fiscal',
                'logo_url',
                'banniere_url',
                'taille_effectif',
                'annee_creation',
                'adresse_siege',
            ]);
        });
    }
};
