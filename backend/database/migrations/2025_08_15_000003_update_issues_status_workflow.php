<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Do not run this migration inside a transaction (helps Postgres surface real errors).
     */
    public $withinTransaction = false;

    public function up(): void
    {
        if (Schema::hasTable('issues')) {
            // Normalize legacy statuses to the new workflow
            // 'open' -> 'submitted' (older default)
            DB::table('issues')->where('status', 'open')->update(['status' => 'submitted']);
            // 'opened' and 'fixed' -> 'inprogress'
            DB::table('issues')->whereIn('status', ['opened', 'fixed'])->update(['status' => 'inprogress']);

            // Set default to 'submitted' cross-DB
            if (Schema::hasColumn('issues', 'status')) {
                $driver = DB::getDriverName();
                if ($driver === 'pgsql') {
                    DB::statement("ALTER TABLE issues ALTER COLUMN status SET DEFAULT 'submitted'");
                } elseif ($driver === 'mysql') {
                    DB::statement("ALTER TABLE issues MODIFY status VARCHAR(255) NOT NULL DEFAULT 'submitted'");
                } else {
                    DB::statement("ALTER TABLE issues ALTER COLUMN status SET DEFAULT 'submitted'");
                }
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('issues')) {
            // Revert mappings for rollback scenarios
            // 'inprogress' -> 'opened'
            DB::table('issues')->where('status', 'inprogress')->update(['status' => 'opened']);
            // 'submitted' -> 'open'
            DB::table('issues')->where('status', 'submitted')->update(['status' => 'open']);

            // Revert default to 'open'
            if (Schema::hasColumn('issues', 'status')) {
                $driver = DB::getDriverName();
                if ($driver === 'pgsql') {
                    DB::statement("ALTER TABLE issues ALTER COLUMN status SET DEFAULT 'open'");
                } elseif ($driver === 'mysql') {
                    DB::statement("ALTER TABLE issues MODIFY status VARCHAR(255) NOT NULL DEFAULT 'open'");
                } else {
                    DB::statement("ALTER TABLE issues ALTER COLUMN status SET DEFAULT 'open'");
                }
            }
        }
    }
};

