<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Employee extends Model
{
    protected $table = 'employees';

    protected $fillable = [
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'username',
        'password',
        'designation',
        'joining_date',
        'salary',
        'address',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

  
    public function user(): HasOne
    {
        return $this->hasOne(
            User::class,
            'employee_id',
            'employee_id'
        );
    }

   
    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(
            Department::class,
            'employee_departments',
            'employee_id',
            'department_id'
        );
    }

    
    public function documents()
    {
        return $this->hasMany(
            EmployeeDocument::class
        );
    }
}
