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
        // Drop and recreate to avoid ENUM rename issues in some MySQL versions
        Schema::table('offre_emplois', function (Blueprint $table) {
            $table->dropColumn('statut_offre');
            $table->string('statut_moderation')->default('pending');
            $table->string('statut_offre')->default('Ouverte');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offre_emplois', function (Blueprint $table) {
            $table->dropColumn(['statut_moderation', 'statut_offre']);
            $table->enum('statut_offre', ['pending', 'approved', 'rejected'])->default('pending');
        });
    }
};
