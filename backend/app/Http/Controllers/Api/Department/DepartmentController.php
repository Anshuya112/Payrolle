<?php

namespace App\Http\Controllers\Api\Department;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
    /**
     * Get all departments
     */
    public function index()
    {
        try {
            $departments = Department::orderBy('name', 'asc')->get();

            return response()->json([
                'success' => true,
                'departments' => $departments,
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Create department
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'description' => 'nullable|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $department = Department::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department added successfully.',
            'department' => $department,
        ], 201);
    }


    /**
     * Get single department
     */
    public function show(Department $department)
    {
        return response()->json([
            'success' => true,
            'department' => $department,
        ], 200);
    }


    /**
     * Update department
     */
    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
            'description' => 'nullable|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $department->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department updated successfully.',
            'department' => $department,
        ], 200);
    }


    /**
     * Delete department
     */
    public function destroy(Department $department)
    {
        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully.',
        ], 200);
    }
}
