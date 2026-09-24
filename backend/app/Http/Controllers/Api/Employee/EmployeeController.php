<?php

namespace App\Http\Controllers\Api\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    
    public function index()
    {
        $employees = Employee::with([
            'departments',
            'documents'
        ])->get();

        return response()->json([
            'success' => true,
            'employees' => $employees
        ]);
    }


   
    public function store(Request $request)
    {
        $validated = $request->validate([

            'first_name' => 'required|string|max:255',

            'last_name' => 'required|string|max:255',

            'email' => 'required|email|unique:employees,email',

            'phone' => 'required|string|max:50',

            
            'department_ids' => 'required|array|min:1',

            'department_ids.*' => 'integer|exists:departments,id',

            'designation' => 'required|string|max:255',

            'joining_date' => 'required|date',

            'salary' => 'required|numeric',

            'address' => 'required|string',

            'aadhar_card' => 'required|file',

            'resume' => 'required|file',

            'pan_card' => 'nullable|file',

            'reports' => 'nullable|file',

            'experience_letter' => 'nullable|file',

            'other_document' => 'nullable|file',
        ]);


        DB::beginTransaction();

        try {

            
            do {

                $employeeId = 'EMP' . rand(1000, 9999);

            } while (
                Employee::where('employee_id', $employeeId)->exists()
            );


           
            $password = Str::password(10);


            $employee = Employee::create([

                'employee_id' => $employeeId,

                'first_name' => $validated['first_name'],

                'last_name' => $validated['last_name'],

                'email' => $validated['email'],

                'phone' => $validated['phone'],

                'password' => Hash::make($password),

                'designation' => $validated['designation'],

                'joining_date' => $validated['joining_date'],

                'salary' => $validated['salary'],

                'address' => $validated['address'],

                'status' => 'Active',
            ]);


           
            $employee->departments()->sync(
                $validated['department_ids']
            );


           
            $documentData = [];


            if ($request->hasFile('aadhar_card')) {

                $documentData['aadhar_card'] =
                    $request->file('aadhar_card')
                        ->store('documents/aadhar');
            }


            if ($request->hasFile('resume')) {

                $documentData['resume'] =
                    $request->file('resume')
                        ->store('documents/resume');
            }


            if ($request->hasFile('pan_card')) {

                $documentData['pan_card'] =
                    $request->file('pan_card')
                        ->store('documents/pan');
            }


            if ($request->hasFile('reports')) {

                $documentData['reports'] =
                    $request->file('reports')
                        ->store('documents/reports');
            }


            if ($request->hasFile('experience_letter')) {

                $documentData['experience_letter'] =
                    $request->file('experience_letter')
                        ->store('documents/experience');
            }


            if ($request->hasFile('other_document')) {

                $documentData['other_document'] =
                    $request->file('other_document')
                        ->store('documents/other');
            }


          
            if (!empty($documentData)) {

                $employee->documents()->create($documentData);
            }


            DB::commit();


            
            return response()->json([

                'success' => true,

                'message' => 'Employee Created Successfully',

                'employee' => $employee->load([
                    'departments',
                    'documents'
                ]),

                // Temporary response for development
                'password' => $password,

            ], 201);


        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => 'Employee creation failed.',

                'error' => $e->getMessage(),

            ], 500);
        }
    }


   
    public function show($id)
    {
        $employee = Employee::with([
            'departments',
            'documents'
        ])->find($id);


        if (!$employee) {

            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }


        return response()->json([
            'success' => true,
            'employee' => $employee
        ]);
    }


   
    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);


        if (!$employee) {

            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }


        $validated = $request->validate([

            'first_name' => 'required|string|max:255',

            'last_name' => 'required|string|max:255',

            'email' =>
                'required|email|unique:employees,email,' . $employee->id,

            'phone' => 'required|string|max:50',

            'department_ids' => 'required|array|min:1',

            'department_ids.*' =>
                'integer|exists:departments,id',

            'designation' => 'required|string|max:255',

            'joining_date' => 'required|date',

            'salary' => 'required|numeric',

            'address' => 'required|string',
        ]);


        $employee->update([

            'first_name' => $validated['first_name'],

            'last_name' => $validated['last_name'],

            'email' => $validated['email'],

            'phone' => $validated['phone'],

            'designation' => $validated['designation'],

            'joining_date' => $validated['joining_date'],

            'salary' => $validated['salary'],

            'address' => $validated['address'],
        ]);


       
        $employee->departments()->sync(
            $validated['department_ids']
        );


        return response()->json([

            'success' => true,

            'message' => 'Employee Updated Successfully',

            'employee' => $employee->load([
                'departments',
                'documents'
            ])
        ]);
    }


    
    public function destroy($id)
    {
        $employee = Employee::find($id);


        if (!$employee) {

            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }


        
        $employee->departments()->detach();


     
        $employee->delete();


        return response()->json([

            'success' => true,

            'message' => 'Employee Deleted Successfully'
        ]);
    }
}
