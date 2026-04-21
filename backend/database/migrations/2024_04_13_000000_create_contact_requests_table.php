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
        Schema::create('contact_requests', function (Blueprint $row) {
            $row->id();
            $row->foreignId('recruiter_id')->constrained('recruiters')->onDelete('cascade');
            $row->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $row->text('message')->nullable();
            $row->string('status')->default('pending'); // pending, accepted, rejected, ignored
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_requests');
    }
};
