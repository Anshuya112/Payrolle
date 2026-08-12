<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';

   protected $fillable = [

    'employee_id',

    'employee_name',

    'date',

    'status',

    'check_in',

    'check_out',

    'working_hours'

];
    
}