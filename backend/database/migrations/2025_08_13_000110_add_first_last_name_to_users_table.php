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
        if (!Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name', 100)->nullable();
            }
            if (!Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name', 100)->nullable();
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'last_name')) {
                $table->dropColumn('last_name');
            }
            if (Schema::hasColumn('users', 'first_name')) {
                $table->dropColumn('first_name');
            }
        });
    }
};
