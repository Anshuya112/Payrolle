<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('password_reset_otps', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('adduser_id');

            $table->string('otp');

            $table->string('reset_token')->nullable();

            $table->timestamp('expires_at');

            $table->unsignedTinyInteger('attempts')->default(0);

            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            $table->index('adduser_id');
            $table->index('reset_token');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('password_reset_otps');
    }
};
