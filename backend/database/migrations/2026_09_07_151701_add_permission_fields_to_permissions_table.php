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
        Schema::create('permissions', function (Blueprint $table) {

            $table->id();

            // Permission name
            $table->string('name')->unique();

            // Role name
            $table->string('role_name');

            // Permission description
            $table->text('description')->nullable();

            // Active / Inactive
            $table->enum('status', [
                'Active',
                'Inactive'
            ])->default('Active');

            // Module + actions JSON
            $table->json('modules')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
