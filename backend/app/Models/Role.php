<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $fillable = [
        'name',
        'description',
        'prefix',
        'status',
    ];

    public function permissions(): HasMany
    {
        return $this->hasMany(
            Permission::class,
            'role_name',
            'name'
        );
    }

    public function addUsers(): BelongsToMany
    {
        return $this->belongsToMany(
            AddUser::class,
            'adduser_role',
            'role_id',
            'adduser_id'
        );
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'role_user',
            'role_id',
            'user_id'
        );
    }
}
