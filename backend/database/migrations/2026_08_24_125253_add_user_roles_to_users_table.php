<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adduser_roles', function (Blueprint $table) {

            $table->id();

            $table->foreignId('adduser_id')
                ->constrained('adduser')
                ->cascadeOnDelete();

            $table->foreignId('role_id')
                ->constrained('roles')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'adduser_id',
                'role_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adduser_roles');
    }
};
