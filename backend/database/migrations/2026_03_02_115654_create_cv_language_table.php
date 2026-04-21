<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('curriculum_vitae_langue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curriculum_vitae_id')->constrained('curriculum_vitaes')->cascadeOnDelete();
            $table->foreignId('langue_id')->constrained('langues')->cascadeOnDelete();
            $table->string('niveau_lu')->nullable(); // e.g. A1, C2
            $table->string('niveau_ecrit')->nullable();
            $table->string('niveau_parle')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curriculum_vitae_langue');
    }
};
