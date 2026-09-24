<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Attendance\AttendanceController;
use App\Http\Controllers\Api\Employee\EmployeeController;
use App\Http\Controllers\Api\Employee\EmployeeDocumentController;
use App\Http\Controllers\Api\Payroll\PayrollController;
use App\Http\Controllers\Api\Department\DepartmentController;
use App\Http\Controllers\Api\AddUserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\Dashboard\DashboardController;






Route::get('/user', function (Request $request) { return $request->user(); })->middleware('auth:sanctum');

Route::post('/attendance', [AttendanceController::class, 'store']);
Route::get('/attendance', [AttendanceController::class, 'index']);
Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);
Route::post('/attendance/login', [AttendanceController::class, 'login']);
Route::get('/attendance/employee/{employee_id}', [AttendanceController::class, 'employeeAttendance']);
Route::post('/attendance/checkin', [AttendanceController::class, 'checkIn']);
Route::post('/attendance/checkout', [AttendanceController::class, 'checkOut']);
Route::get('/attendance/search/{id}', [AttendanceController::class, 'searchEmployee']);

Route::post('/employees', [EmployeeController::class, 'store']);
Route::get('/employees', [EmployeeController::class, 'index']);
Route::get('/employees/{id}', [EmployeeController::class, 'show']);
Route::put('/employees/{id}', [EmployeeController::class, 'update']);
Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

Route::get('/employee-documents/{id}', [EmployeeDocumentController::class, 'show']);

Route::get('/payrolls', [PayrollController::class, 'index']);
Route::get('/payrolls/{id}', [PayrollController::class, 'show']);
Route::delete('/payrolls/{id}', [PayrollController::class, 'destroy']);
Route::get('/payroll/generate', [PayrollController::class, 'create']);
Route::post('/payroll/generate', [PayrollController::class, 'generate']);
Route::get('/payroll/history', [PayrollController::class, 'history']);

Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::get('/departments/{department}', [DepartmentController::class, 'show']);
Route::put('/departments/{department}', [DepartmentController::class, 'update']);
Route::delete('/departments/{department}', [DepartmentController::class, 'destroy']);
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [AddUserController::class, 'index']);
    Route::post('/users', [AddUserController::class, 'store']);
    Route::get('/users/{id}', [AddUserController::class, 'show']);
    Route::put('/users/{id}', [AddUserController::class, 'update']);
    Route::delete('/users/{id}', [AddUserController::class, 'destroy']);

});
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{id}', [RoleController::class, 'show']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::get('/permissions/{id}', [PermissionController::class, 'show']);
    Route::put('/permissions/{id}', [PermissionController::class, 'update']);
    Route::delete('/permissions/{id}', [PermissionController::class, 'destroy']);

    Route::get('/my-permissions', [PermissionController::class, 'myPermissions']);
});


Route::get('/Dashboard', [DashboardController::class, 'index']);
Route::post('/Dashboard', [DashboardController::class, 'store']);
Route::get('/Dashboard/{id}', [DashboardController::class, 'show']);
Route::put('/Dashboard/{id}', [DashboardController::class, 'update']);
Route::delete('/Dashboard/{id}', [DashboardController::class, 'delete']);



Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
Route::post('/logout', [AuthController::class, 'logout']);
});


Route::middleware('auth:sanctum')
    ->delete(
        '/employees/{id}',
        [EmployeeController::class, 'destroy']
    )
    ->middleware(
        'permission:employee,delete'
    );

Route::post('/role-login', [AuthController::class, 'roleLogin']);