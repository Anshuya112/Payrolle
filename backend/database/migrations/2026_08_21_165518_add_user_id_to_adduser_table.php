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
    Schema::table('adduser', function (Blueprint $table) {

        $table->string('user_id', 50)
            ->unique()
            ->after('id');

        $table->dropColumn('employee_id');
    });
}

public function down(): void
{
    Schema::table('adduser', function (Blueprint $table) {

        $table->string('employee_id', 50)
            ->nullable()
            ->after('phone');

        $table->dropColumn('user_id');
    });
}

};
