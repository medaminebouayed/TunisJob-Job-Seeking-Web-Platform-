<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('curriculum_vitae_competence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curriculum_vitae_id')->constrained('curriculum_vitaes')->cascadeOnDelete();
            $table->foreignId('competence_id')->constrained('competences')->cascadeOnDelete();
            $table->string('niveau_maitrise')->nullable(); // e.g. Débutant, Intermédiaire, Expert
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curriculum_vitae_competence');
    }
};