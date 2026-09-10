<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('role_user', function (Blueprint $table) {

            $table->foreignId('adduser_id')
                ->nullable()
                ->after('user_id')
                ->constrained('adduser')
                ->cascadeOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('role_user', function (Blueprint $table) {

            $table->dropForeign(['adduser_id']);
            $table->dropColumn('adduser_id');

        });
    }
};
