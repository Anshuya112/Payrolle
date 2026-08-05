<?php

namespace App\Http\Controllers\Api\Attendance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;


class AttendanceController extends Controller
{


public function getAttendance($code)
{
    $employee = Employee::where('employee_id', $code)->first();


    if (!$employee) {

        return response()->json([
            "message" => "Employee not found"
        ], 404);

    }


    $attendance = Attendance::where('employee_id', $employee->employee_id)
        ->latest()
        ->first();


    return response()->json([

        "employee" => $employee,

        "attendance" => $attendance

    ]);

}



public function login(Request $request)
{

    $request->validate([
        'employee_id' => 'required',
        'email' => 'required|email'
    ]);


    $employee = Employee::where(
        'employee_id',
        $request->employee_id
    )
    ->where(
        'email',
        $request->email
    )
    ->first();



    if (!$employee) {

        return response()->json([
            'message' => 'Invalid Employee ID or Email'
        ],401);

    }



    return response()->json([

        'message' => 'Login Successful',

        'employee' => $employee

    ]);

}

public function employeeAttendance($employee_id)
{
    $employee = Employee::where(
        'employee_id',
        $employee_id
    )->first();


    if (!$employee) {

        return response()->json([
            "message"=>"Employee Not Found"
        ],404);

    }


    $attendance = Attendance::where(
        'employee_id',
        $employee->id
    )
    ->latest()
    ->first();


    return response()->json([
        "employee"=>$employee,
        "attendance"=>$attendance
    ]);
}

  public function getEmployee($employeeCode)
{
    $employee = Employee::where('employee_id', $employeeCode)->first();

    if (!$employee) {
        return response()->json([
            "message" => "Employee not found"
        ], 404);
    }

    return response()->json([
        'employee' => [
            'employee_code' => $employee->employee_id,
            'name'          => $employee->first_name . ' ' . $employee->last_name,
            'department'    => $employee->department,
            'date'          => $employee->joining_date,
            'shift'         => $employee->shift,
        ]
    ]);
}
    

    public function index(Request $request)
    {

         $query = Attendance::query();

    if ($request->search) {
        $query->where('employee_id', 'like', '%' . $request->search . '%')
              ->orWhere('employee_name', 'like', '%' . $request->search . '%');
    }

    return response()->json($query->get());
         return response()->json(
        Attendance::all()
    );
    }

    public function store(Request $request)
    {
         $request->validate([
            'employee_id' => 'required',
            'employee_name' => 'required',
            'date' => 'required|date',
            'status' => 'required',
            'check_in' => 'required',
            'check_out' => 'required',
         ]);
            $attendance = Attendance::create($request->all());

        return response()->json([
            'message' => 'Attendance Added Successfully',
            'data' => $attendance
        ], 201);
    }

    public function show(string $id)
    {
       return Attendance::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $attendance = Attendance::findOrFail($id);

        $attendance->update($request->all());

        return response()->json([
            'message' => 'Attendance Updated',
            'data' => $attendance
        ]);
    }

    public function destroy( $id)
    {
           $attendance = Attendance::findOrFail($id);

            $attendance->delete();

        return response()->json([
            'message' => 'Attendance Deleted'
        ]);
    }


        public function searchEmployee($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                "message" => "Employee not found"
            ], 404);
        }

        return response()->json([
            "employee" => $employee
        ]);
    }




public function checkIn(Request $request)
{

    $employee = Employee::where(
        'employee_id',
        $request->employee_id
    )->first();


    if(!$employee){

        return response()->json([
            "message"=>"Employee not found"
        ],404);

    }


    $today = date('Y-m-d');


    // Already checked today?
    $already = Attendance::where(
        'employee_id',
        $employee->id
    )
    ->whereDate(
        'date',
        $today
    )
    ->first();



    if($already){

        return response()->json([
            "message"=>"Already Checked In"
        ],400);

    }



    Attendance::create([

        "employee_id"=>$employee->id,

        "employee_name" =>
        $employee->first_name." ".$employee->last_name,

        "date"=>$today,

        "status"=>"Present",

        "check_in"=>date("H:i:s"),

        "check_out"=>null

    ]);



    return response()->json([

        "message"=>"Check In Successful"

    ]);

}


public function checkOut(Request $request)
{

    $employee = Employee::where(
        'employee_id',
        $request->employee_id
    )->first();



    $today=date('Y-m-d');


    $attendance = Attendance::where(
        'employee_id',
        $employee->id
    )
    ->whereDate(
        'date',
        $today
    )
    ->first();



    if(!$attendance){

        return response()->json([
            "message"=>"Please Check In First"
        ],400);

    }



    if($attendance->check_out){

        return response()->json([
            "message"=>"Already Checked Out"
        ],400);

    }



    $attendance->check_out = date("H:i:s");



    $checkIn = Carbon::parse(
        $attendance->check_in
    );


    $checkOut = Carbon::parse(
        $attendance->check_out
    );



    $attendance->working_hours =
    $checkIn->diff($checkOut)
    ->format("%H Hours %I Minutes");



    $attendance->save();



    return response()->json([

        "message"=>"Check Out Successful",

        "working_hours"=>$attendance->working_hours

    ]);

}

}


