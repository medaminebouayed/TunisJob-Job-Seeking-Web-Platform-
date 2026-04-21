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
        Schema::table('candidates', function (Blueprint $table) {
            $table->string('prenom')->nullable();
            $table->string('nom')->nullable();
            $table->string('civilite')->nullable();
            $table->string('url_photo_profil')->nullable();
            $table->string('url_portfolio')->nullable();
            $table->string('url_linkedin')->nullable();
            $table->date('date_naissance')->nullable();
            
            // Renaming existing fields to match diagram
            $table->renameColumn('address', 'adresse');
            $table->renameColumn('profile_title', 'titre_profil');
            $table->renameColumn('search_active', 'recherche_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropColumn(['prenom', 'nom', 'civilite', 'url_photo_profil', 'url_portfolio', 'url_linkedin', 'date_naissance']);
            $table->renameColumn('adresse', 'address');
            $table->renameColumn('titre_profil', 'profile_title');
            $table->renameColumn('recherche_active', 'search_active');
        });
    }
};
