<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // MySQL-compatible: change default of users.role to 'citizen'
        DB::statement("ALTER TABLE `users` MODIFY `role` VARCHAR(255) NOT NULL DEFAULT 'citizen'");
    }

    public function down(): void
    {
        // Revert default back to 'user'
        DB::statement("ALTER TABLE `users` MODIFY `role` VARCHAR(255) NOT NULL DEFAULT 'user'");
    }
};
