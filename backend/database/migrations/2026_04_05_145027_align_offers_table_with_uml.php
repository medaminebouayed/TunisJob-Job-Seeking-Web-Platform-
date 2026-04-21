<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Since 'offers' is empty and renaming columns is failing due to dialect issues, 
        // we safely drop and recreate the tables to align perfectly with the UML.
        
        Schema::dropIfExists('candidatures');
        Schema::dropIfExists('offers');

        Schema::create('offre_emplois', function (Blueprint $table) {
            $table->id();
            $table->string('reference_offre')->nullable();
            $table->foreignId('recruiter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('enterprise_id')->constrained()->cascadeOnDelete();
            $table->string('titre_poste');
            $table->text('description');
            $table->text('profil_recherche')->nullable();
            $table->text('proposition_avantages')->nullable();
            $table->string('type_contrat');
            $table->string('niveau_etude_requis')->nullable();
            $table->string('experience_requise')->nullable();
            $table->decimal('salaire_min', 10, 2)->nullable();
            $table->decimal('salaire_max', 10, 2)->nullable();
            $table->string('devise')->default('TND');
            $table->string('frequence_salaire')->default('Par mois');
            $table->boolean('est_anonyme')->default(false);
            $table->integer('nombre_poste_pourvoir')->default(1);
            $table->dateTime('date_publication')->nullable();
            $table->dateTime('date_expiration')->nullable();
            $table->enum('statut_offre', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_emploi_id')->constrained('offre_emplois')->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->text('lettre_motivation')->nullable();
            $table->string('etat_avancement')->default('En attente');
            $table->dateTime('date_postulation')->useCurrent();
            $table->string('cv_envoye_url')->nullable();
            $table->text('note_recruteur')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidatures');
        Schema::dropIfExists('offre_emplois');

        // Recreate original simple offers table if rolled back
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recruiter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('enterprise_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('contract_type');
            $table->string('experience_level')->nullable();
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->constrained('offers')->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->text('lettre_motivation')->nullable();
            $table->string('etat_avancement')->default('En attente');
            $table->dateTime('date_postulation')->useCurrent();
            $table->string('cv_envoye_url')->nullable();
            $table->text('note_recruiter')->nullable();
            $table->timestamps();
        });
    }
};
