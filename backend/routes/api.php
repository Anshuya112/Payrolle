<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Attendance\AttendanceController;
use App\Http\Controllers\Api\Employee\EmployeeController;
use App\Http\Controllers\Api\Employee\EmployeeDocumentController;
use App\Http\Controllers\Api\Payroll\PayrollController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/attendance', [AttendanceController::class, 'store']);
Route::get('/attendance', [AttendanceController::class, 'index']);
Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);

Route::post('/attendance/login', [AttendanceController::class, 'login']);

Route::get('/attendance/employee/{employee_id}',[AttendanceController::class, 'employeeAttendance']);
Route::get('/attendance/employee/{employee_id}',[AttendanceController::class, 'employeeAttendance']);

Route::get('/attendance/employee/{id}', [AttendanceController::class, 'searchEmployee']);
Route::post('/attendance/checkin', [AttendanceController::class, 'checkIn']);
Route::post('/attendance/checkout', [AttendanceController::class, 'checkOut']);

Route::post('/employees',[EmployeeController::class,'store']);
Route::get('/employees',[EmployeeController::class,'index']);
Route::get("/employees/{id}",[EmployeeController::class,"show"]);
Route::put("/employees/{id}",[EmployeeController::class,"update"]);
Route::delete('/employees/{id}',[EmployeeController::class,'destroy']);

Route::get('/employee-documents/{id}',[EmployeeDocumentController::class,'show']);



Route::get('/payrolls', [PayrollController::class, 'index']);
Route::get('/payroll/generate', [PayrollController::class, 'create']);
Route::post('/payroll/generate', [PayrollController::class, 'store']);
Route::get('/payrolls/{id}', [PayrollController::class, 'show']);
Route::delete('/payrolls/{id}', [PayrollController::class, 'destroy']);