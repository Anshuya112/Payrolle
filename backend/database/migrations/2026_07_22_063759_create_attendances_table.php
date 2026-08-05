<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();

            $table->string('employee_id');
            $table->string('employee_name');

            $table->date('date');

            $table->enum('status', [
                'Present',
                'Absent',
                'Half Day',
                'Work From Home'
            ]);

            $table->time('check_in');
             $table->time('check_out')->nullable()->change();

            $table->timestamps();
        });
    }

    public function down()
{
    Schema::table('attendances', function (Blueprint $table) {
        $table->time('check_out')->nullable(false)->change();
    });
}
};