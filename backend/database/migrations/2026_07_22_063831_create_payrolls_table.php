
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       
        Schema::dropIfExists('payrolls');
        
        
        Schema::create('payrolls', function (Blueprint $table) {

            $table->id();

            $table->foreignId('employee_id')
                ->constrained('employees')
                ->cascadeOnDelete();

            $table->string('payroll_month');
            $table->unsignedInteger('payroll_year');

            $table->decimal('working_days', 8, 2)->default(0);
            $table->decimal('overtime_hours', 8, 2)->default(0);

            $table->decimal('basic_salary', 12, 2)->default(0);
            $table->decimal('daily_salary', 12, 2)->default(0);
            $table->decimal('overtime_rate', 12, 2)->default(0);

            $table->decimal('overtime', 12, 2)->default(0);
            $table->decimal('allowance', 12, 2)->default(0);
            $table->decimal('bonus', 12, 2)->default(0);

            $table->decimal('total_earnings', 12, 2)->default(0);

            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('pf', 12, 2)->default(0);
            $table->decimal('loan', 12, 2)->default(0);
            $table->decimal('other_deduction', 12, 2)->default(0);

            $table->decimal('total_deductions', 12, 2)->default(0);

            $table->decimal('net_salary', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
