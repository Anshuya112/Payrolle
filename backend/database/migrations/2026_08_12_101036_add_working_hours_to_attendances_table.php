<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
       Schema::table('attendances', function (Blueprint $table) {
          $table->string('working_hours')->nullable()->after('check_out');
       }); 
    }

    
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
           $table->dropColumn('working_hours');
        });
    }
};
