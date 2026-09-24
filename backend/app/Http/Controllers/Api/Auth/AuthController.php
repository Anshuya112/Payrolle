<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\AddUser;
use App\Models\Userss;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{public function login(Request $request)
{
    $validated = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    $username = $validated['username'];
    $password = $validated['password'];

    // 1. Check User
    $user = User::where('username', $username)->first();

    if ($user && Hash::check($password, $user->password)) {

        if (
            isset($user->status) &&
            strtolower($user->status) !== 'active'
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive.',
            ], 403);
        }

        $token = $user->createToken('payroll-auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'source' => 'user',
            ],
            'redirect' => '/dashboard',
        ], 200);
    }

    // 2. Check AddUser
    $addUser = AddUser::where('username', $username)->first();

    if (
        $addUser &&
        Hash::check($password, $addUser->password)
    ) {

        if (
            isset($addUser->status) &&
            strtolower($addUser->status) !== 'active'
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive.',
            ], 403);
        }

        $token = $addUser->createToken('payroll-auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token' => $token,
            'user' => [
                'id' => $addUser->id,
                'username' => $addUser->username,
                'source' => 'adduser',
            ],
            'redirect' => '/dashboard',
        ], 200);
    }

    // 3. Check Userss
    $employeeUser = Userss::where('username', $username)->first();

    if (
        $employeeUser &&
        Hash::check($password, $employeeUser->password)
    ) {

        if (
            isset($employeeUser->status) &&
            strtolower($employeeUser->status) !== 'active'
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive.',
            ], 403);
        }

        $token = $employeeUser
            ->createToken('payroll-auth-token')
            ->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token' => $token,
            'user' => [
                'id' => $employeeUser->id,
                'employee_id' => $employeeUser->employee_id,
                'username' => $employeeUser->username,
                'status' => $employeeUser->status,
                'source' => 'userss',
            ],
            'redirect' => '/dashboard',
        ], 200);
    }

    // Invalid login
    return response()->json([
        'success' => false,
        'message' => 'Invalid username or password.',
    ], 401);
}


   

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->currentAccessToken()?->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout successful.',
        ], 200);
    }







public function roleLogin(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'role' => 'required|in:super_admin,hr,employee',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 401);
    }

    if (!Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid password'
        ], 401);
    }

    if ($user->role !== $request->role) {
        return response()->json([
            'message' => 'Selected role does not match your account'
        ], 403);
    }

    $token = $user->createToken('role-login-token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user
    ]);
}










}
