<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Normalize legacy statuses to the new workflow
        // 'open' -> 'submitted' (older default)
        DB::table('issues')->where('status', 'open')->update(['status' => 'submitted']);
        // 'opened' and 'fixed' -> 'inprogress'
        DB::table('issues')->whereIn('status', ['opened', 'fixed'])->update(['status' => 'inprogress']);

        // Set default to 'submitted' without requiring doctrine/dbal
        // Works for MySQL/MariaDB
        DB::statement("ALTER TABLE `issues` MODIFY `status` VARCHAR(255) NOT NULL DEFAULT 'submitted'");
    }

    public function down(): void
    {
        // Revert mappings for rollback scenarios
        // 'inprogress' -> 'opened'
        DB::table('issues')->where('status', 'inprogress')->update(['status' => 'opened']);
        // 'submitted' -> 'open'
        DB::table('issues')->where('status', 'submitted')->update(['status' => 'open']);

        // Revert default to 'open'
        DB::statement("ALTER TABLE `issues` MODIFY `status` VARCHAR(255) NOT NULL DEFAULT 'open'");
    }
};
