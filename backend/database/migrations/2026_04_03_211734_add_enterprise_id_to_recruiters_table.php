<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('recruiters', function (Blueprint $table) {
            $table->foreignId('enterprise_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('recruiters', function (Blueprint $table) {
            $table->dropForeign(['enterprise_id']);
            $table->dropColumn('enterprise_id');
        });
    }
};
