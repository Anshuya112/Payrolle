<?php

namespace App\Http\Controllers\Api\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;

class EmployeeController extends Controller
{

    
    public function index()
    {
        $employees = Employee::all();

        return response()->json([
            "employees" => $employees
        ]);
    }




    public function store(Request $request)
{

    $request->validate([

        "first_name"=>"required",
        "last_name"=>"required",
        "email"=>"required|unique:employees,email",
        "phone"=>"required",

        "aadhar_card"=>"required|file",
        "resume"=>"required|file"

    ]);



    // CREATE EMPLOYEE

    $employee = Employee::create([

        "employee_id" => "EMP".rand(1000,9999),

        "first_name" => $request->first_name,

        "last_name" => $request->last_name,

        "email" => $request->email,

        "phone" => $request->phone,

        "department" => $request->department,

        "designation" => $request->designation,

        "joining_date" => $request->joining_date,

        "salary" => $request->salary,

        "address" => $request->address,

        "status"=>"Active"

    ]);




    // DOCUMENT UPLOAD

    $documentData = [

        "employee_id"=>$employee->id

    ];



    if($request->hasFile('aadhar_card'))
    {

        $documentData['aadhar_card'] = 
        $request->file('aadhar_card')
        ->store('documents/aadhar');

    }



    if($request->hasFile('resume'))
    {

        $documentData['resume'] = 
        $request->file('resume')
        ->store('documents/resume');

    }



    if($request->hasFile('pan_card'))
    {

        $documentData['pan_card'] =
        $request->file('pan_card')
        ->store('documents/pan');

    }



    if($request->hasFile('reports'))
    {

        $documentData['reports'] =
        $request->file('reports')
        ->store('documents/reports');

    }



    if($request->hasFile('experience_letter'))
    {

        $documentData['experience_letter'] =
        $request->file('experience_letter')
        ->store('documents/experience');

    }



    if($request->hasFile('other_document'))
    {

        $documentData['other_document'] =
        $request->file('other_document')
        ->store('documents/other');

    }



    // SAVE DOCUMENT TABLE

    $employee->documents()->create($documentData);



    return response()->json([

        "message"=>"Employee Created Successfully",

        "employee"=>$employee,

    ]);

  }




   public function show($id)
{
    $employee = Employee::find($id);

    if(!$employee)
    {
        return response()->json([
            "message"=>"Employee not found"
        ],404);
    }


    return response()->json([
        "employee"=>$employee
    ]);
}



    public function update(Request $request,$id)
    {

        $employee = Employee::find($id);

        $employee->update($request->all());


        return response()->json([
            "message"=>"Employee Updated"
        ]);

    }



    
    public function destroy($id)
    {

        Employee::find($id)->delete();


        return response()->json([
            "message"=>"Employee Deleted"
        ]);

    }

}