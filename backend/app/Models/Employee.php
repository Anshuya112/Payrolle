<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\EmployeeDocument;

class Employee extends Model
{

    protected $fillable = [

        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'department',
        'designation',
        'joining_date',
        'salary',
        'address'

    ];

    
    
    public function documents()
{

    return $this->hasMany(EmployeeDocument::class);

}


}