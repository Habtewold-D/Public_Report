<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Do not run this migration inside a transaction (helps Postgres surface real errors).
     */
    public $withinTransaction = false;

    public function up(): void
    {
        Schema::create('issue_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('issue_id')->constrained('issues')->onDelete('cascade');
            $table->string('path');
            $table->string('original_name')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('issue_images');
    }
};
