<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'userss';

    protected $fillable = [
        'employee_id',
        'username',
        'password',
        'status',
        'send_welcome_email',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
