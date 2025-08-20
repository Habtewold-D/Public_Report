<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Do not run this migration inside a transaction (helps Postgres surface real errors).
     */
    public $withinTransaction = false;

    public function up(): void
    {
        if (!Schema::hasTable('users') || !Schema::hasColumn('users', 'role')) {
            return; // Nothing to do
        }

        $driver = DB::getDriverName();
        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'citizen'");
        } elseif ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role VARCHAR(255) NOT NULL DEFAULT 'citizen'");
        } else {
            // Fallback: try a generic SET DEFAULT
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'citizen'");
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('users') || !Schema::hasColumn('users', 'role')) {
            return; // Nothing to do
        }

        $driver = DB::getDriverName();
        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'");
        } elseif ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role VARCHAR(255) NOT NULL DEFAULT 'user'");
        } else {
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'");
        }
    }
};
