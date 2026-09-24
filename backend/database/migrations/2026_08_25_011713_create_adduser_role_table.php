<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adduser_role', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('adduser_id');
            $table->unsignedBigInteger('role_id');

            $table->unique([
                'adduser_id',
                'role_id'
            ]);

            $table->foreign('adduser_id')
                ->references('id')
                ->on('adduser')
                ->cascadeOnDelete();

            $table->foreign('role_id')
                ->references('id')
                ->on('roles')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adduser_role');
    }
};
