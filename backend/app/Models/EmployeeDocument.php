<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDocument extends Model
{

    protected $table = "employee_documents";


    protected $fillable = [

        'employee_id',
        'aadhar_card',
        'resume',
        'pan_card',
        'reports',
        'experience_letter',
        'other_document'

    ];


    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

}