<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {

            $table->string('name')->after('id');
            $table->text('description')->nullable()->after('name');
            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active')
                ->after('description');

        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {

            $table->dropColumn([
                'name',
                'description',
                'status',
            ]);

        });
    }
};