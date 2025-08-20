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
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // reporter
            $table->unsignedBigInteger('sector_id'); // sector user (referencing users)
            $table->text('description');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('status')->default('open');
            $table->timestamps();
        });

        // Add foreign keys in a separate step to better surface errors on Postgres
        Schema::table('issues', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('sector_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
