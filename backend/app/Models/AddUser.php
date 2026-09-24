<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AddUser extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'adduser';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'department',
        'designation',
        'username',
        'password',
        'status',
        'send_welcome_email',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'send_welcome_email' => 'boolean',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            Role::class,
            'adduser_role',
            'adduser_id',
            'role_id'
        );
    }

    public function passwordResetOtps(): HasMany
    {
        return $this->hasMany(
            PasswordResetOtp::class,
            'adduser_id'
        );
    }
}
