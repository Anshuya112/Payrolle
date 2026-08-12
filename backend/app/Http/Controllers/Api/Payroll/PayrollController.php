<?php

namespace App\Http\Controllers\Api\Payroll;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;

class PayrollController extends Controller
{
    /**
     * Generate Payroll page / employee list
     */
    public function create()
    {
        $employees = Employee::orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return response()->json([
            'employees' => $employees,
        ]);
    }


    /**
     * Store / Generate Payroll
     */
    public function store(Request $request)
    {
        // Validate React request
        $validated = $request->validate([
            'employee_id' => 'required|string',

            'month' => 'required|string',
            'year' => 'required|integer',

            'working_days' => 'required|numeric',
            'overtime_hours' => 'nullable|numeric',

            'daily_salary' => 'nullable|numeric',
            'overtime_rate' => 'nullable|numeric',

            'basic_salary' => 'required|numeric',
            'allowance' => 'nullable|numeric',
            'bonus' => 'nullable|numeric',
            'overtime' => 'nullable|numeric',

            'total_earnings' => 'required|numeric',

            'tax' => 'nullable|numeric',
            'pf' => 'nullable|numeric',
            'loan' => 'nullable|numeric',
            'other' => 'nullable|numeric',

            'total_deductions' => 'required|numeric',
            'net_salary' => 'nullable|numeric',
        ]);


        $employee = Employee::where(
            'employee_id',
            $validated['employee_id']
        )->first();


        if (!$employee) {
            return response()->json([
                'message' => 'Employee not found.',
                'employee_id' => $validated['employee_id'],
            ], 404);
        }


       

        $payroll = Payroll::create([

            
            'employee_id' => $employee->id,

            
            'payroll_month' => $validated['month'],
            'payroll_year' => $validated['year'],

        
            'working_days' => $validated['working_days'],
            'overtime_hours' => $validated['overtime_hours'] ?? 0,

            'daily_salary' => $validated['daily_salary'] ?? 0,
            'overtime_rate' => $validated['overtime_rate'] ?? 0,

            'basic_salary' => $validated['basic_salary'],
            'allowance' => $validated['allowance'] ?? 0,
            'bonus' => $validated['bonus'] ?? 0,
            'overtime' => $validated['overtime'] ?? 0,

            'total_earnings' => $validated['total_earnings'],

            'tax' => $validated['tax'] ?? 0,
            'pf' => $validated['pf'] ?? 0,
            'loan' => $validated['loan'] ?? 0,

            'other_deduction' => $validated['other'] ?? 0,

            'total_deductions' => $validated['total_deductions'],

            'net_salary' => $validated['net_salary'] ?? 0,
        ]);



        return response()->json([
            'message' => 'Payroll generated successfully.',

            'payroll' => $payroll->load('employee'),
        ], 201);
    }


    public function index()
    {
        $payrolls = Payroll::with('employee')
            ->latest()
            ->paginate(15);

        return response()->json([
            'payrolls' => $payrolls,
        ]);
    }

    public function show(Payroll $payroll)
    {
        $payroll->load('employee');

        return response()->json([
            'payroll' => $payroll,
        ]);
    }


    public function destroy(Payroll $payroll)
    {
        $payroll->delete();

        return response()->json([
            'message' => 'Payroll deleted successfully.',
        ]);
    }
}
