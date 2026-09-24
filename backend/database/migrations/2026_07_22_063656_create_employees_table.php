<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {

            $table->id();

            // Employee Basic Information

            $table->string('employee_id')->unique();

            $table->string('first_name');

            $table->string('last_name');

            $table->string('email')->unique();

            $table->string('phone');
            $table->string('password')->unique();




            // Job Information

            $table->string('department');

            $table->string('designation');

            $table->date('joining_date');

            $table->decimal('salary',10,2);



            // Profile

            $table->string('profile_image')
                  ->nullable();


            $table->text('address')
                  ->nullable();



            // Status

            $table->enum('status',[
                'Active',
                'Inactive'
            ])
            ->default('Active');



            $table->timestamps();

        });
    }


    public function down(): void
    {
        Schema::dropIfExists('employees');
         $table->dropColumn('password');
    }

};