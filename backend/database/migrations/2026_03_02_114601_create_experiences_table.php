<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('experiences_pro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curriculum_vitae_id')->constrained('curriculum_vitaes')->cascadeOnDelete();
            $table->string('titre_poste');
            $table->string('nom_employeur');
            $table->string('lieu')->nullable();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->boolean('poste_actuelle')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences_pro');
    }
};