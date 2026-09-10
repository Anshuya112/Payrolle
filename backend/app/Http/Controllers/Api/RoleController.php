<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
   
    public function index()
    {
        try {

            $roles = Role::withCount('permissions')
                ->orderBy('id', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'roles' => $roles,
            ], 200);

        } catch (\Throwable $e) {

            \Log::error('Fetch Roles Error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch roles.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function store(Request $request)
    {
        $validated = $request->validate([

            'name' => [
                'required',
                'string',
                'max:100',
                'unique:roles,name',
            ],

            'description' => [
                'nullable',
                'string',
                'max:255',
            ],

            'prefix' => [
                'required',
                'string',
                'max:20',
                'unique:roles,prefix',
            ],

            'status' => [
                'required',
                'in:Active,Inactive',
            ],
        ]);


        DB::beginTransaction();

        try {

            $role = Role::create([
                'name' =>
                    trim($validated['name']),

                'description' =>
                    $validated['description']
                    ?? null,

                'prefix' =>
                    strtoupper(
                        trim($validated['prefix'])
                    ),

                'status' =>
                    $validated['status'],
            ]);


            DB::commit();


            return response()->json([
                'success' => true,

                'message' =>
                    'Role created successfully.',

                'role' => $role,
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            \Log::error('Role Creation Error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,

                'message' =>
                    'Role creation failed.',

                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }


    public function show($id)
    {
        try {

            $role = Role::with('permissions')
                ->find($id);


            if (!$role) {

                return response()->json([
                    'success' => false,
                    'message' => 'Role not found.',
                ], 404);
            }


            return response()->json([
                'success' => true,
                'role' => $role,
            ], 200);

        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch role.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


  
    

    public function update(Request $request, $id)
    {
        $role = Role::find($id);


        if (!$role) {

            return response()->json([
                'success' => false,
                'message' => 'Role not found.',
            ], 404);
        }


        $validated = $request->validate([

            'name' => [
                'required',
                'string',
                'max:100',
                'unique:roles,name,' . $role->id,
            ],

            'description' => [
                'nullable',
                'string',
                'max:255',
            ],

            'prefix' => [
                'required',
                'string',
                'max:20',
                'unique:roles,prefix,' . $role->id,
            ],

            'status' => [
                'required',
                'in:Active,Inactive',
            ],
        ]);


        try {

            $role->update([

                'name' =>
                    trim($validated['name']),

                'description' =>
                    $validated['description']
                    ?? null,

                'prefix' =>
                    strtoupper(
                        trim($validated['prefix'])
                    ),

                'status' =>
                    $validated['status'],
            ]);


            return response()->json([
                'success' => true,

                'message' =>
                    'Role updated successfully.',

                'role' =>
                    $role->fresh(),
            ], 200);

        } catch (\Throwable $e) {

            \Log::error('Role Update Error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,

                'message' =>
                    'Role update failed.',

                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }



    public function destroy($id)
    {
        $role = Role::find($id);


        if (!$role) {

            return response()->json([
                'success' => false,
                'message' => 'Role not found.',
            ], 404);
        }


        

        try {

            $addUsers =
                method_exists($role, 'addUsers')
                    ? $role->addUsers()->count()
                    : 0;


            $employeeUsers =
                method_exists($role, 'users')
                    ? $role->users()->count()
                    : 0;


            if (
                ($addUsers + $employeeUsers) > 0
            ) {

                return response()->json([
                    'success' => false,

                    'message' =>
                        'This role is assigned to users and cannot be deleted.',
                ], 422);
            }


           
            $role->permissions()->detach();


            $role->delete();


            return response()->json([
                'success' => true,

                'message' =>
                    'Role deleted successfully.',
            ], 200);

        } catch (\Throwable $e) {

            \Log::error('Role Delete Error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,

                'message' =>
                    'Unable to delete role.',

                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }
}
