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
        Schema::table('recruiters', function (Blueprint $table) {
            $table->renameColumn('job_title', 'fonction_entreprise');
            $table->renameColumn('is_verified', 'est_verifie');
            $table->string('telephone_pro')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recruiters', function (Blueprint $table) {
            $table->renameColumn('fonction_entreprise', 'job_title');
            $table->renameColumn('est_verifie', 'is_verified');
            $table->dropColumn('telephone_pro');
        });
    }
};
