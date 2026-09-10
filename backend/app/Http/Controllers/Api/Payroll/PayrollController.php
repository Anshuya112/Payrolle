<?php

namespace App\Http\Controllers\Api\Payroll;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;

class PayrollController extends Controller
{
    
    public function create()
    {
        $employees = Employee::orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return response()->json([
            'employees' => $employees,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string',

            'month' => 'required|string',
            'year' => 'required|integer',

            'working_days' => 'required|numeric|min:0',
            'overtime_hours' => 'nullable|numeric|min:0',

            'daily_salary' => 'nullable|numeric|min:0',
            'overtime_rate' => 'nullable|numeric|min:0',

            'basic_salary' => 'required|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'overtime' => 'nullable|numeric|min:0',

            'total_earnings' => 'required|numeric|min:0',

            'tax' => 'nullable|numeric|min:0',
            'pf' => 'nullable|numeric|min:0',
            'loan' => 'nullable|numeric|min:0',
            'other' => 'nullable|numeric|min:0',

            'total_deductions' => 'required|numeric|min:0',
            'net_salary' => 'nullable|numeric',
        ]);


        

        $employee = Employee::where(
            'employee_id',
            $validated['employee_id']
        )->first();


        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found.',
                'employee_id' => $validated['employee_id'],
            ], 404);
        }


       

        $payroll = Payroll::create([

            // employees.id
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

            'status' => 'Generated',
        ]);


        

        $payroll->load('employee');


        return response()->json([
            'success' => true,
            'message' => 'Payroll generated successfully.',
            'payroll' => $payroll,
        ], 201);
    }


   
    public function index()
    {
        $payrolls = Payroll::with('employee')
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'payrolls' => $payrolls,
        ]);
    }


    public function show(Payroll $payroll)
    {
        $payroll->load('employee');

        return response()->json([
            'success' => true,
            'payroll' => $payroll,
        ]);
    }


    
    public function history(Request $request)
    {
        $query = Payroll::with('employee');


       

        if (
            $request->filled('month') &&
            $request->month !== 'All'
        ) {
            $query->where(
                'payroll_month',
                $request->month
            );
        }



        if (
            $request->filled('year') &&
            $request->year !== 'All'
        ) {
            $query->where(
                'payroll_year',
                $request->year
            );
        }


        $payrolls = $query
            ->latest()
            ->get();


        return response()->json([
            'success' => true,
            'payrolls' => $payrolls,
        ]);
    }


    
    public function destroy(Payroll $payroll)
    {
        $payroll->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payroll deleted successfully.',
        ]);
    }
}