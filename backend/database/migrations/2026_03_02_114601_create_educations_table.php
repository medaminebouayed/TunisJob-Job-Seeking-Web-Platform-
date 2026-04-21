<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curriculum_vitae_id')->constrained('curriculum_vitaes')->cascadeOnDelete();
            $table->string('nom_diplome');
            $table->string('etablissement');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->string('niveau_acquis')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};