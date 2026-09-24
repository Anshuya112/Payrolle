<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employee;

class Payroll extends Model
{
    protected $fillable = [
        'employee_id',

        'payroll_month',
        'payroll_year',

        'working_days',
        'overtime_hours',

        'basic_salary',
        'daily_salary',
        'overtime_rate',

        'overtime',
        'allowance',
        'bonus',

        'total_earnings',

        'tax',
        'pf',
        'loan',
        'other_deduction',

        'total_deductions',
        'net_salary',
    ];


    protected $casts = [
        'payroll_year' => 'integer',

        'working_days' => 'decimal:2',
        'overtime_hours' => 'decimal:2',

        'basic_salary' => 'decimal:2',
        'daily_salary' => 'decimal:2',
        'overtime_rate' => 'decimal:2',

        'overtime' => 'decimal:2',
        'allowance' => 'decimal:2',
        'bonus' => 'decimal:2',

        'total_earnings' => 'decimal:2',

        'tax' => 'decimal:2',
        'pf' => 'decimal:2',
        'loan' => 'decimal:2',
        'other_deduction' => 'decimal:2',

        'total_deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];


    public function employee()
    {
        return $this->belongsTo(
            Employee::class,
            'employee_id',
            'id'
        );
    }
}