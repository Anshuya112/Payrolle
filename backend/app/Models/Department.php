<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employee;

class Department extends Model
{
    protected $table = 'departments';

    protected $fillable = [
        'name',
        'description',
        'status',
    ];

    public function employees()
    {
        return $this->belongsToMany(
            Employee::class,
            'employee_departments',
            'department_id',
            'employee_id'
        );
    }
}
