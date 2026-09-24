<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adduser', function (Blueprint $table) {

            $table->id();

            $table->string('user_id', 50)->unique();

            $table->string('first_name', 100);
            $table->string('last_name', 100);

            $table->string('email', 255)->unique();
            $table->string('phone', 20);

            $table->string('department', 100)->nullable();
            $table->string('designation', 100)->nullable();

            $table->string('role', 100);

            $table->string('username', 100)->unique();

            $table->string('password', 255);

            $table->enum('status', [
                'Active',
                'Inactive'
            ])->default('Active');

            $table->boolean('send_welcome_email')
                ->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adduser');
    }
};
