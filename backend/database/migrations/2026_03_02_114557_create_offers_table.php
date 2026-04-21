<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};