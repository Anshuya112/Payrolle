<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AddUser;
use App\Models\User;
use App\Models\Employee;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AddUserController extends Controller
{
   


    private function generateUserId(string $role): string
    {
        $roleModel = Role::where('name', $role)->first();

        $prefix = $roleModel?->prefix;

        if (!$prefix) {
            $prefix = match (trim($role)) {
                'Super Admin' => 'SA',
                'HR Manager'  => 'HR',
                'Accountant'  => 'ACC',
                'Manager'     => 'MGR',
                'Admin'       => 'ADM',
                'Employee'    => 'EMP',
                default       => 'USR',
            };
        }

        $prefix = strtoupper(trim($prefix));

       
        $lastUser = AddUser::where(
            'user_id',
            'like',
            $prefix . '%'
        )
            ->orderByDesc('id')
            ->first();


        if (!$lastUser || empty($lastUser->user_id)) {
            return $prefix . '1001';
        }

     
        $numberPart = substr(
            $lastUser->user_id,
            strlen($prefix)
        );

        $number = (int) $numberPart;

        if ($number < 1001) {
            $number = 1000;
        }

        return $prefix . ($number + 1);
    }


   
    public function index()
    {
        try {

          

            $employeeUsers = User::with([
                'roles',
                'employee.departments',
            ])
                ->get()
                ->map(function ($user) {

                    $employee = $user->employee;

                    return [
                        'id' => $user->id,

                        'first_name' =>
                            $employee?->first_name ?? '',

                        'last_name' =>
                            $employee?->last_name ?? '',

                        'email' =>
                            $employee?->email ?? '',

                        'phone' =>
                            $employee?->phone ?? '',

                        'employee_id' =>
                            $user->employee_id,

                        'user_id' => null,

                        'department' =>
                            $employee?->departments
                                ?->pluck('name')
                                ->implode(', ') ?? '',

                        'designation' =>
                            $employee?->designation ?? '',

                        'roles' =>
                            $user->roles
                                ->map(function ($role) {
                                    return [
                                        'id' => $role->id,
                                        'name' => $role->name,
                                    ];
                                })
                                ->values(),

                        /*  Multiple role names */

                        'role' =>
                            $user->roles
                                ->pluck('name')
                                ->implode(', '),

                        'username' =>
                            $user->username,

                        'status' =>
                            $user->status,

                        'send_welcome_email' =>
                            (bool) $user->send_welcome_email,

                        'created_at' =>
                            $user->created_at,

                        'source' =>
                            'userss',
                    ];
                });


          
            $otherUsers = AddUser::with('roles')
                ->get()
                ->map(function ($user) {

                    return [
                        'id' => $user->id,

                        'first_name' =>
                            $user->first_name ?? '',

                        'last_name' =>
                            $user->last_name ?? '',

                        'email' =>
                            $user->email ?? '',

                        'phone' =>
                            $user->phone ?? '',

                        'user_id' =>
                            $user->user_id,

                        'employee_id' =>
                            null,

                        'department' =>
                            $user->department ?? '',

                        'designation' =>
                            $user->designation ?? '',

                        'roles' =>
                            $user->roles
                                ->map(function ($role) {
                                    return [
                                        'id' => $role->id,
                                        'name' => $role->name,
                                    ];
                                })
                                ->values(),

                        'role' =>
                            $user->roles
                                ->pluck('name')
                                ->implode(', '),

                        'username' =>
                            $user->username,

                        'status' =>
                            $user->status,

                        'send_welcome_email' =>
                            (bool) $user->send_welcome_email,

                        'created_at' =>
                            $user->created_at,

                        'source' =>
                            'adduser',
                    ];
                });


          

            $users = $employeeUsers
                ->concat($otherUsers)
                ->values();


            return response()->json([
                'success' => true,
                'message' => 'Users fetched successfully.',
                'users' => $users,
            ], 200);


        } catch (\Throwable $e) {

            \Log::error('Fetch Users Error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch users.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ], 500);
        }
    }


   public function store(Request $request)
{
    $validated = $request->validate([

        'first_name' => [
            'required',
            'string',
            'max:100',
        ],

        'last_name' => [
            'required',
            'string',
            'max:100',
        ],

        'email' => [
            'required',
            'email',
            'max:255',
        ],

        'phone' => [
            'required',
            'string',
            'max:20',
        ],

        'role_ids' => [
            'required',
            'array',
            'min:1',
        ],

        'role_ids.*' => [
            'integer',
            'exists:roles,id',
        ],

        'employee_id' => [
            'nullable',
            'string',
            'max:50',
        ],

        'department' => [
            'nullable',
            'string',
            'max:100',
        ],

        'designation' => [
            'nullable',
            'string',
            'max:100',
        ],

        'username' => [
            'required',
            'string',
            'max:100',
        ],

        'password' => [
            'required',
            'string',
            'min:8',
            'confirmed',
        ],

        'status' => [
            'required',
            'in:Active,Inactive',
        ],

        'send_welcome_email' => [
            'nullable',
            'boolean',
        ],
    ]);


    /*
    |--------------------------------------------------------------------------
    | Role IDs
    |--------------------------------------------------------------------------
    */

    $roleIds = collect($validated['role_ids'])
        ->map(fn ($id) => (int) $id)
        ->unique()
        ->values()
        ->toArray();


    if (empty($roleIds)) {

        return response()->json([
            'success' => false,
            'message' => 'Please select at least one role.',
            'errors' => [
                'role_ids' => [
                    'Please select at least one role.'
                ]
            ],
        ], 422);
    }


    /*
    |--------------------------------------------------------------------------
    | Get Roles
    |--------------------------------------------------------------------------
    */

    $roles = Role::whereIn(
        'id',
        $roleIds
    )->get();


    if (
        $roles->count() !== count($roleIds)
    ) {

        return response()->json([
            'success' => false,
            'message' =>
                'One or more selected roles are invalid.',
        ], 422);
    }


    /*
    |--------------------------------------------------------------------------
    | Employee Role?
    |--------------------------------------------------------------------------
    */

    $isEmployee = $roles->contains(
        function ($role) {
            return strtolower(
                trim($role->name)
            ) === 'employee';
        }
    );


    DB::beginTransaction();

    try {

        $username = trim(
            $validated['username']
        );


        /*
        |--------------------------------------------------------------------------
        | Username Must Be Unique Across BOTH Tables
        |--------------------------------------------------------------------------
        */

        $usernameExists =
            AddUser::where(
                'username',
                $username
            )->exists()
            ||
            User::where(
                'username',
                $username
            )->exists();


        if ($usernameExists) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' =>
                    'Username is already in use.',

                'errors' => [
                    'username' => [
                        'Username is already in use.'
                    ]
                ],
            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | EMPLOYEE USER
        |--------------------------------------------------------------------------
        */

        if ($isEmployee) {

            if (
                empty(
                    $validated['employee_id']
                )
            ) {

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' =>
                        'Employee ID is required for Employee role.',

                    'errors' => [
                        'employee_id' => [
                            'Employee ID is required.'
                        ]
                    ],
                ], 422);
            }


            $employee = Employee::where(
                'employee_id',
                $validated['employee_id']
            )->first();


            if (!$employee) {

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' =>
                        'Selected employee does not exist.',

                    'errors' => [
                        'employee_id' => [
                            'Selected employee does not exist.'
                        ]
                    ],
                ], 422);
            }


            /*
            |--------------------------------------------------------------------------
            | Employee Already Has Account
            |--------------------------------------------------------------------------
            */

            $alreadyExists = User::where(
                'employee_id',
                $employee->employee_id
            )->exists();


            if ($alreadyExists) {

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' =>
                        'This employee already has a user account.',

                    'errors' => [
                        'employee_id' => [
                            'This employee already has a user account.'
                        ]
                    ],
                ], 422);
            }


            /*
            |--------------------------------------------------------------------------
            | Create USERSS account
            |--------------------------------------------------------------------------
            */

            $user = User::create([

                'employee_id' =>
                    $employee->employee_id,

                'username' =>
                    $username,

                'password' =>
                    Hash::make(
                        $validated['password']
                    ),

                'status' =>
                    $validated['status'],

                'send_welcome_email' =>
                    $validated['send_welcome_email']
                    ?? false,
            ]);


            /*
            |--------------------------------------------------------------------------
            | Attach Roles
            |--------------------------------------------------------------------------
            */

            $user->roles()->sync(
                $roleIds
            );


            DB::commit();


            return response()->json([
                'success' => true,

                'message' =>
                    'Employee user created successfully.',

                'source' =>
                    'userss',

                'user' =>
                    $user->load('roles'),

            ], 201);
        }


        /*
        |--------------------------------------------------------------------------
        | NORMAL ADDUSER ACCOUNT
        |--------------------------------------------------------------------------
        */

        $primaryRole = $roles->first();


        $generatedUserId =
            $this->generateUserId(
                $primaryRole->name
            );


        /*
        |--------------------------------------------------------------------------
        | Create ADDUSER account
        |--------------------------------------------------------------------------
        */

        $user = AddUser::create([

            'user_id' =>
                $generatedUserId,

            'first_name' =>
                $validated['first_name'],

            'last_name' =>
                $validated['last_name'],

            'email' =>
                $validated['email'],

            'phone' =>
                $validated['phone'],

            'department' =>
                $validated['department']
                ?? null,

            'designation' =>
                $validated['designation']
                ?? null,

            'username' =>
                $username,

            'password' =>
                Hash::make(
                    $validated['password']
                ),

            'status' =>
                $validated['status'],

            'send_welcome_email' =>
                $validated['send_welcome_email']
                ?? false,
        ]);


        /*
        |--------------------------------------------------------------------------
        | Attach Roles
        |--------------------------------------------------------------------------
        */

        $user->roles()->sync(
            $roleIds
        );


        DB::commit();


        return response()->json([
            'success' => true,

            'message' =>
                'User created successfully.',

            'source' =>
                'adduser',

            'user' =>
                $user->load('roles'),

        ], 201);


    } catch (\Throwable $e) {

        DB::rollBack();

        \Log::error(
            'Create User Error',
            [
                'message' =>
                    $e->getMessage(),

                'line' =>
                    $e->getLine(),

                'file' =>
                    $e->getFile(),
            ]
        );


        return response()->json([
            'success' => false,

            'message' =>
                'Unable to create user.',

            'error' =>
                $e->getMessage(),

        ], 500);
    }
}


    public function show(Request $request, $id)
    {
        try {

            $source =
                $request->query('source');


            
            if ($source === 'userss') {

                $user = User::with([
                    'roles',
                    'employee.departments',
                ])->find($id);


                if (!$user) {

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'Employee user not found.',
                    ], 404);
                }


                return response()->json([
                    'success' => true,
                    'data' => $user,
                    'source' => 'userss',
                ], 200);
            }


        

            if ($source === 'adduser') {

                $user = AddUser::with(
                    'roles'
                )->find($id);


                if (!$user) {

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'User not found.',
                    ], 404);
                }


                return response()->json([
                    'success' => true,
                    'data' => $user,
                    'source' => 'adduser',
                ], 200);
            }


            return response()->json([
                'success' => false,
                'message' =>
                    'User source is required.',
            ], 422);


        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to fetch user.',
                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }



    public function update(
        Request $request,
        $id
    ) {

     
        $validated = $request->validate([

            'first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'last_name' => [
                'required',
                'string',
                'max:100',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:20',
            ],

            'role_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'role_ids.*' => [
                'integer',
                'exists:roles,id',
            ],

            'employee_id' => [
                'nullable',
                'string',
                'max:50',
            ],

            'department' => [
                'nullable',
                'string',
                'max:100',
            ],

            'designation' => [
                'nullable',
                'string',
                'max:100',
            ],

            'username' => [
                'required',
                'string',
                'max:100',
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],

            'status' => [
                'required',
                'in:Active,Inactive',
            ],

            'send_welcome_email' => [
                'nullable',
                'boolean',
            ],

            'source' => [
                'required',
                'in:adduser,userss',
            ],
        ]);


       
        $roleIds = collect(
            $validated['role_ids']
        )
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->toArray();


        $roles = Role::whereIn(
            'id',
            $roleIds
        )->get();


        if ($roles->count() !== count($roleIds)) {

            return response()->json([
                'success' => false,
                'message' =>
                    'One or more selected roles are invalid.',
            ], 422);
        }


        
        $isEmployee = $roles->contains(
            function ($role) {

                return strtolower(
                    trim($role->name)
                ) === 'employee';
            }
        );


        $source =
            $validated['source'];


        $username =
            trim(
                $validated['username']
            );


        DB::beginTransaction();

        try {

            /* Load current user */

            if ($source === 'userss') {

                $currentUser =
                    User::find($id);

            } else {

                $currentUser =
                    AddUser::find($id);
            }


            if (!$currentUser) {

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' =>
                        $source === 'userss'
                            ? 'Employee user not found.'
                            : 'User not found.',
                ], 404);
            }



            if ($source === 'userss') {

                $usernameExists =
                    User::where(
                        'username',
                        $username
                    )
                        ->where(
                            'id',
                            '!=',
                            $id
                        )
                        ->exists()
                    ||
                    AddUser::where(
                        'username',
                        $username
                    )->exists();

            } else {

                $usernameExists =
                    AddUser::where(
                        'username',
                        $username
                    )
                        ->where(
                            'id',
                            '!=',
                            $id
                        )
                        ->exists()
                    ||
                    User::where(
                        'username',
                        $username
                    )->exists();
            }


            if ($usernameExists) {

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' =>
                        'Username is already in use.',
                    'errors' => [
                        'username' => [
                            'Username is already in use.'
                        ]
                    ],
                ], 422);
            }


          
            if ($source === 'userss') {

               

                if (!$isEmployee) {

                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'Employee user must have Employee role.',
                    ], 422);
                }


               

                if (empty($validated['employee_id'])) {

                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'Employee ID is required.',
                    ], 422);
                }


                $employee =
                    Employee::where(
                        'employee_id',
                        $validated['employee_id']
                    )->first();


                if (!$employee) {

                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'Selected employee does not exist.',
                    ], 422);
                }


               

                $employeeAlreadyUsed =
                    User::where(
                        'employee_id',
                        $validated['employee_id']
                    )
                        ->where(
                            'id',
                            '!=',
                            $id
                        )
                        ->exists();


                if ($employeeAlreadyUsed) {

                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'This employee already has another user account.',
                    ], 422);
                }


                

                $currentUser->employee_id =
                    $employee->employee_id;

                $currentUser->username =
                    $username;

                $currentUser->status =
                    $validated['status'];

                $currentUser->send_welcome_email =
                    $validated[
                        'send_welcome_email'
                    ] ?? false;


                if (
                    !empty(
                        $validated['password']
                    )
                ) {

                    $currentUser->password =
                        Hash::make(
                            $validated['password']
                        );
                }


                $currentUser->save();


                

                $currentUser->roles()->sync(
                    $roleIds
                );


                DB::commit();


                return response()->json([
                    'success' => true,
                    'message' =>
                        'Employee user updated successfully.',
                    'source' =>
                        'userss',
                    'user' =>
                        $currentUser->load(
                            'roles'
                        ),
                ], 200);
            }




            if ($isEmployee) {

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' =>
                        'Employee role cannot be assigned to a normal user. Please use an employee account.',
                ], 422);
            }


            
            $currentUser->first_name =
                $validated['first_name'];

            $currentUser->last_name =
                $validated['last_name'];

            $currentUser->email =
                $validated['email'];

            $currentUser->phone =
                $validated['phone'];

            $currentUser->department =
                $validated['department']
                ?? null;

            $currentUser->designation =
                $validated['designation']
                ?? null;

            $currentUser->username =
                $username;

            $currentUser->status =
                $validated['status'];

            $currentUser->send_welcome_email =
                $validated[
                    'send_welcome_email'
                ] ?? false;



            if (
                !empty(
                    $validated['password']
                )
            ) {

                $currentUser->password =
                    Hash::make(
                        $validated['password']
                    );
            }


            $currentUser->save();


           

            $currentUser->roles()->sync(
                $roleIds
            );


            DB::commit();


            return response()->json([
                'success' => true,
                'message' =>
                    'User updated successfully.',
                'source' =>
                    'adduser',
                'user' =>
                    $currentUser->load(
                        'roles'
                    ),
            ], 200);


        } catch (\Throwable $e) {

            DB::rollBack();

            \Log::error(
                'Update User Error',
                [
                    'message' =>
                        $e->getMessage(),

                    'line' =>
                        $e->getLine(),

                    'file' =>
                        $e->getFile(),
                ]
            );


            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to update user.',
                'error' =>
                    $e->getMessage(),
                'line' =>
                    $e->getLine(),
            ], 500);
        }
    }


 
    public function destroy(
        Request $request,
        $id
    ) {

        $source =
            $request->query('source');


        DB::beginTransaction();

        try {

           

            if ($source === 'adduser') {

                $user =
                    AddUser::find($id);


                if (!$user) {

                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'User not found.',
                    ], 404);
                }


              
                $user->roles()->detach();


              
                $user->delete();


                DB::commit();


                return response()->json([
                    'success' => true,
                    'message' =>
                        'User deleted successfully.',
                    'source' =>
                        'adduser',
                ], 200);
            }


          

            if ($source === 'userss') {

                $user =
                    User::find($id);


                if (!$user) {

                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' =>
                            'Employee user not found.',
                    ], 404);
                }


               
                $user->roles()->detach();


                $user->delete();


                DB::commit();


                return response()->json([
                    'success' => true,
                    'message' =>
                        'Employee user deleted successfully.',
                    'source' =>
                        'userss',
                ], 200);
            }


            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' =>
                    'User source is required.',
            ], 422);


        } catch (\Throwable $e) {

            DB::rollBack();

            \Log::error(
                'Delete User Error',
                [
                    'message' =>
                        $e->getMessage(),

                    'line' =>
                        $e->getLine(),

                    'file' =>
                        $e->getFile(),
                ]
            );


            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to delete user.',
                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }
}
