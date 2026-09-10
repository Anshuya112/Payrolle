<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            [
                'name' => 'employee.view',
                'description' => 'View employees'
            ],

            [
                'name' => 'employee.create',
                'description' => 'Create employees'
            ],

            [
                'name' => 'employee.edit',
                'description' => 'Edit employees'
            ],

            [
                'name' => 'employee.delete',
                'description' => 'Delete employees'
            ],

            [
                'name' => 'payroll.view',
                'description' => 'View payroll'
            ],

            [
                'name' => 'payroll.create',
                'description' => 'Create payroll'
            ],

            [
                'name' => 'user.view',
                'description' => 'View users'
            ],

            [
                'name' => 'user.create',
                'description' => 'Create users'
            ],

            [
                'name' => 'user.edit',
                'description' => 'Edit users'
            ],

            [
                'name' => 'user.delete',
                'description' => 'Delete users'
            ],

            [
                'name' => 'role.view',
                'description' => 'View roles'
            ],

            [
                'name' => 'role.create',
                'description' => 'Create roles'
            ],

            [
                'name' => 'role.edit',
                'description' => 'Edit roles'
            ],

            [
                'name' => 'role.delete',
                'description' => 'Delete roles'
            ],
        ];


        foreach ($permissions as $permission) {

            Permission::updateOrCreate(
                [
                    'name' => $permission['name']
                ],
                $permission
            );
        }
    }
}
