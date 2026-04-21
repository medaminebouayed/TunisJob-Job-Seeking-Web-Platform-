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
        Schema::create('localite_offres', function (Blueprint $table) {
            $table->id();
            $table->string('pays')->default('Tunisie');
            $table->string('gouvernorat')->nullable();
            $table->string('ville')->nullable();
            $table->string('code_postal')->nullable();
            $table->timestamps();
        });

        Schema::table('offre_emplois', function (Blueprint $table) {
            $table->foreignId('specialty_id')->nullable()->constrained('specialties')->nullOnDelete();
            $table->foreignId('localite_offre_id')->nullable()->constrained('localite_offres')->nullOnDelete();
        });

        Schema::create('offre_emploi_langue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_emploi_id')->constrained('offre_emplois')->cascadeOnDelete();
            $table->foreignId('langue_id')->constrained('langues')->cascadeOnDelete();
            $table->string('niveau_requis')->default('Intermediate');
            $table->timestamps();
        });

        Schema::create('offre_emploi_competence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_emploi_id')->constrained('offre_emplois')->cascadeOnDelete();
            $table->foreignId('competence_id')->constrained('competences')->cascadeOnDelete();
            $table->string('niveau_requis')->default('Intermediate');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offre_emploi_competence');
        Schema::dropIfExists('offre_emploi_langue');
        Schema::table('offre_emplois', function (Blueprint $table) {
            $table->dropConstrainedForeignId('specialty_id');
            $table->dropConstrainedForeignId('localite_offre_id');
        });
        Schema::dropIfExists('localite_offres');
    }
};
