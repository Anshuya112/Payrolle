<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
 
    public function index()
    {
        $permissions = Permission::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'permissions' => $permissions,
        ]);
    }

   
    public function show($id)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'permission' => $permission,
        ]);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'role_name' => [
            'required',
            'string',
            'max:255',
        ],

        'name' => [
            'required',
            'string',
            'max:255',
            'unique:permissionss,name',
        ],

        'description' => [
            'required',
            'string',
        ],

        'status' => [
            'required',
            Rule::in([
                'Active',
                'Inactive',
            ]),
        ],

        'modules' => [
            'required',
            'array',
            'min:1',
        ],

        'modules.*.module' => [
            'required',
            'string',
            'max:255',
        ],

        'modules.*.actions' => [
            'required',
            'array',
        ],

        'modules.*.actions.view' => [
            'required',
            'boolean',
        ],

        'modules.*.actions.create' => [
            'required',
            'boolean',
        ],

        'modules.*.actions.edit' => [
            'required',
            'boolean',
        ],

        'modules.*.actions.delete' => [
            'required',
            'boolean',
        ],

        'modules.*.actions.approve' => [
            'required',
            'boolean',
        ],

        'modules.*.actions.export' => [
            'required',
            'boolean',
        ],
    ]);

    
    $role = \App\Models\Role::where(
        'name',
        trim($validated['role_name'])
    )->first();

    if (!$role) {
        return response()->json([
            'success' => false,
            'message' => 'Selected role does not exist.',
            'errors' => [
                'role_name' => [
                    'Selected role does not exist.'
                ]
            ]
        ], 422);
    }

   

    if (
        trim($validated['role_name']) !==
        trim($validated['name'])
    ) {
        return response()->json([
            'success' => false,
            'message' =>
                'Permission name must be exactly the same as the role name.',

            'errors' => [
                'name' => [
                    'Permission name must be exactly the same as the role name.'
                ]
            ]
        ], 422);
    }

   
    $modules = collect($validated['modules'])
        ->map(function ($module) {

            return [
                'module' => trim($module['module']),

                'actions' => [
                    'view' =>
                        (bool) ($module['actions']['view'] ?? false),

                    'create' =>
                        (bool) ($module['actions']['create'] ?? false),

                    'edit' =>
                        (bool) ($module['actions']['edit'] ?? false),

                    'delete' =>
                        (bool) ($module['actions']['delete'] ?? false),

                    'approve' =>
                        (bool) ($module['actions']['approve'] ?? false),

                    'export' =>
                        (bool) ($module['actions']['export'] ?? false),
                ],
            ];
        })
        ->values()
        ->toArray();

   

    $hasAction = false;

    foreach ($modules as $module) {
        foreach ($module['actions'] as $action) {
            if ($action === true) {
                $hasAction = true;
                break 2;
            }
        }
    }

    if (!$hasAction) {
        return response()->json([
            'success' => false,
            'message' =>
                'At least one action must be selected.',

            'errors' => [
                'modules' => [
                    'At least one action must be selected.'
                ]
            ]
        ], 422);
    }



    $permission = Permission::create([
        'name' =>
            trim($validated['name']),

        'role_name' =>
            trim($validated['role_name']),

        'description' =>
            trim($validated['description']),

        'status' =>
            $validated['status'],

        'modules' =>
            $modules,
    ]);

    
    $role->permissions()->syncWithoutDetaching([
        $permission->id
    ]);


    return response()->json([
        'success' => true,
        'message' =>
            'Permission created successfully.',

        'permission' =>
            $permission->fresh(),

        'role' => [
            'id' => $role->id,
            'name' => $role->name,
        ],
    ], 201);
}

    
    public function update(Request $request, $id)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found.',
            ], 404);
        }

        $validated = $request->validate([
            'role_name' => [
                'required',
                'string',
                'max:255',
            ],

            'name' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'permissionss',
                    'name'
                )->ignore($permission->id),
            ],

            'description' => [
                'required',
                'string',
            ],

            'status' => [
                'required',
                Rule::in([
                    'Active',
                    'Inactive',
                ]),
            ],

            'modules' => [
                'required',
                'array',
                'min:1',
            ],

            'modules.*.module' => [
                'required',
                'string',
                'max:255',
            ],

            'modules.*.actions' => [
                'required',
                'array',
            ],

            'modules.*.actions.view' => [
                'required',
                'boolean',
            ],

            'modules.*.actions.create' => [
                'required',
                'boolean',
            ],

            'modules.*.actions.edit' => [
                'required',
                'boolean',
            ],

            'modules.*.actions.delete' => [
                'required',
                'boolean',
            ],

            'modules.*.actions.approve' => [
                'required',
                'boolean',
            ],

            'modules.*.actions.export' => [
                'required',
                'boolean',
            ],
        ]);

      
        if (
            trim($validated['role_name']) !==
            trim($validated['name'])
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Permission name must be exactly the same as the role name.',

                'errors' => [
                    'name' => [
                        'Permission name must be exactly the same as the role name.'
                    ]
                ]
            ], 422);
        }

        $modules = collect($validated['modules'])
            ->map(function ($module) {

                return [
                    'module' => $module['module'],

                    'actions' => [
                        'view' =>
                            (bool) ($module['actions']['view'] ?? false),

                        'create' =>
                            (bool) ($module['actions']['create'] ?? false),

                        'edit' =>
                            (bool) ($module['actions']['edit'] ?? false),

                        'delete' =>
                            (bool) ($module['actions']['delete'] ?? false),

                        'approve' =>
                            (bool) ($module['actions']['approve'] ?? false),

                        'export' =>
                            (bool) ($module['actions']['export'] ?? false),
                    ],
                ];
            })
            ->values()
            ->toArray();

        $hasAction = false;

        foreach ($modules as $module) {

            foreach ($module['actions'] as $action) {

                if ($action === true) {
                    $hasAction = true;
                    break 2;
                }
            }
        }

        if (!$hasAction) {
            return response()->json([
                'success' => false,
                'message' =>
                    'At least one action must be selected.',

                'errors' => [
                    'modules' => [
                        'At least one action must be selected.'
                    ]
                ]
            ], 422);
        }

       
        $permission->update([
            'name' =>
                trim($validated['name']),

            'role_name' =>
                trim($validated['role_name']),

            'description' =>
                trim($validated['description']),

            'status' =>
                $validated['status'],

            'modules' =>
                $modules,
        ]);

        return response()->json([
            'success' => true,
            'message' =>
                'Permission updated successfully.',

            'permission' =>
                $permission->fresh(),
        ]);
    }

    
    public function destroy($id)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found.',
            ], 404);
        }

        $permission->delete();

        return response()->json([
            'success' => true,
            'message' =>
                'Permission deleted successfully.',
        ]);
    }

public function myPermissions(Request $request)
{
    try {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $user->load('roles.permissions');


        \Log::info('USER ROLES', [
    'user_id' => $user->id,
    'roles' => $user->roles->map(fn ($role) => [
        'id' => $role->id,
        'name' => $role->name,
        'status' => $role->status,
    ]),
]);

\Log::info('LOADED PERMISSIONS', [
    'permissions' => $user->roles->flatMap->permissions->map(fn ($permission) => [
        'id' => $permission->id,
        'name' => $permission->name,
        'role_name' => $permission->role_name,
        'status' => $permission->status,
        'modules' => $permission->modules,
    ]),
]);


        \Log::info('PERMISSION RELATION DEBUG', [
    'user_id' => $user->id,
    'roles' => $user->roles->map(function ($role) {
        return [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'status' => $role->status,
            'permissions_count' => $role->permissions->count(),
            'permissions' => $role->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'role_name' => $permission->role_name,
                    'status' => $permission->status,
                ];
            }),
        ];
    }),
]);

        

        $permissions = [];

        foreach ($user->roles as $role) {

            if (
                isset($role->status) &&
                strtolower((string) $role->status) !== 'active'
            ) {
                continue;
            }

            foreach ($role->permissions as $permission) {

                if (
                    isset($permission->status) &&
                    strtolower((string) $permission->status) !== 'active'
                ) {
                    continue;
                }

                $modules = $permission->modules;

                if (!is_array($modules)) {
                    continue;
                }

                foreach ($modules as $module) {

                    if (!is_array($module)) {
                        continue;
                    }

                   $moduleName = trim(
    (string) ($module['module'] ?? '')
);

if ($moduleName === '') {
    continue;
}

$moduleKey = strtolower($moduleName);


/*
|--------------------------------------------------------------------------
| USER & ROLE
|--------------------------------------------------------------------------
| "User & Role" module gives permission to both:
| user.* and role.*
|--------------------------------------------------------------------------
*/
if ($moduleKey === 'user & role') {

    $actions = $module['actions'] ?? [];

    if (!is_array($actions)) {
        continue;
    }

    foreach ($actions as $action => $value) {

        $actionKey = strtolower(
            trim((string) $action)
        );

        $allowed =
            $value === true ||
            $value === 1 ||
            $value === '1' ||
            strtolower((string) $value) === 'true' ||
            strtolower((string) $value) === 'yes';

        if (!isset($permissions['user'])) {
            $permissions['user'] = [];
        }

        if (!isset($permissions['role'])) {
            $permissions['role'] = [];
        }

        if (!isset($permissions['permission'])) {
            $permissions['permission'] = [];
        }

        $permissions['user'][$actionKey] = $allowed;
        $permissions['role'][$actionKey] = $allowed;
        $permissions['permission'][$actionKey] = $allowed;
    }

    continue;
}


$moduleKey = match ($moduleKey) {

    'employees',
    'employee' => 'employee',

    'departments',
    'department' => 'department',

    'designations',
    'designation' => 'designation',

    'users',
    'user' => 'user',

    'roles',
    'role' => 'role',

    'permissions',
    'permission' => 'permission',

    'reports',
    'report' => 'report',

    'payroll',
    'payrolls' => 'payroll',

    'leave',
    'leaves' => 'leave',

    'salary',
    'salaries' => 'salary',

    'attendance',
    'attendances' => 'attendance',

    'loan',
    'loans' => 'loan',

    'payslip',
    'payslips' => 'payslip',

    'tax',
    'taxes' => 'tax',

    'dashboard' => 'dashboard',

    'settings' => 'settings',

    'overtime' => 'overtime',

    default => str_replace(
        ' ',
        '_',
        $moduleKey
    ),
};


                    if (!isset($permissions[$moduleKey])) {
                        $permissions[$moduleKey] = [];
                    }

                    $actions = $module['actions'] ?? [];

                    if (!is_array($actions)) {
                        continue;
                    }

                    foreach ($actions as $action => $value) {

                        $actionKey = strtolower(
                            trim((string) $action)
                        );

                        $allowed =
                            $value === true ||
                            $value === 1 ||
                            $value === '1' ||
                            strtolower((string) $value) === 'true' ||
                            strtolower((string) $value) === 'yes';

                        if ($allowed) {
                            $permissions[$moduleKey][$actionKey] = true;
                        } elseif (
                            !isset(
                                $permissions[$moduleKey][$actionKey]
                            )
                        ) {
                            $permissions[$moduleKey][$actionKey] = false;
                        }
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'permissions' => $permissions,
        ], 200);

    } catch (\Throwable $e) {

        \Log::error('myPermissions error', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}
}