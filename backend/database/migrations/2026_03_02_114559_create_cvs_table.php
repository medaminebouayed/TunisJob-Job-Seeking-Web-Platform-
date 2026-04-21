<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('curriculum_vitaes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->string('titre_cv');
            $table->text('synthese_profil')->nullable();
            $table->string('fichier_pdf')->nullable();
            $table->boolean('est_principal')->default(false);
            $table->boolean('est_visible')->default(true);
            $table->dateTime('dernier_maj')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curriculum_vitaes');
    }
};