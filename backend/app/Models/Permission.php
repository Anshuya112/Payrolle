<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $table = 'permissionss';

    protected $fillable = [
        'name',
        'role_name',
        'description',
        'status',
        'modules',
    ];

    protected $casts = [
        'modules' => 'array',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            Role::class,
            'role_permissions',
            'permission_id',
            'role_id'
        );
    }

    public function hasPermission(
        string $module,
        string $action
    ): bool {
        if (strtolower((string) $this->status) !== 'active') {
            return false;
        }

        foreach ($this->modules ?? [] as $item) {
            if (!is_array($item)) {
                continue;
            }

            if (
                strtolower(trim((string) ($item['module'] ?? ''))) ===
                strtolower(trim($module))
            ) {
                return (bool) (
                    $item['actions'][$action] ?? false
                );
            }
        }

        return false;
    }
}
