<?php

namespace App\Http\Controllers\Api\Auth;

use Twilio\Rest\Client;
use App\Http\Controllers\Controller;
use App\Models\AddUser;
use App\Models\PasswordResetOtp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
   
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255'],
        ]);

        $user = AddUser::where(
            'username',
            trim($request->username)
        )->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Username not found.',
            ], 404);
        }

        if ($user->status !== 'Active') {
            return response()->json([
                'success' => false,
                'message' => 'This account is inactive.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'User found.',
            'email_available' => !empty($user->email),
            'mobile_available' => !empty($user->phone),
        ]);
    }


   
    public function sendResetOtp(Request $request)
{
    $request->validate([
        'username' => ['required', 'string', 'max:255'],
        'method' => ['required', 'in:email,mobile'],
    ]);

    $user = AddUser::where('username', $request->username)->first();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Username not found.',
        ], 404);
    }

    if ($user->status !== 'Active') {
        return response()->json([
            'success' => false,
            'message' => 'This account is inactive.',
        ], 403);
    }

    if ($request->method === 'email' && empty($user->email)) {
        return response()->json([
            'success' => false,
            'message' => 'No email is registered with this account.',
        ], 400);
    }

    if ($request->method === 'mobile' && empty($user->phone)) {
        return response()->json([
            'success' => false,
            'message' => 'No mobile number is registered with this account.',
        ], 400);
    }

    
    $otp = (string) random_int(100000, 999999);

   
    PasswordResetOtp::where(
        'adduser_id',
        $user->id
    )->delete();

    // Save OTP in database
    PasswordResetOtp::create([
        'adduser_id' => $user->id,
        'otp' => Hash::make($otp),
        'reset_token' => null,
        'expires_at' => now()->addMinutes(5),
        'attempts' => 0,
        'verified_at' => null,
    ]);


    if ($request->method === 'email') {

        try {

            Mail::raw(
                "Hello {$user->first_name},\n\n"
                . "Your Payroll password reset OTP is:\n\n"
                . "{$otp}\n\n"
                . "This OTP will expire in 5 minutes.\n\n"
                . "If you did not request a password reset, please ignore this email.",
                function ($message) use ($user) {

                    $message
                        ->to($user->email)
                        ->subject('Payroll Password Reset OTP');
                }
            );

        } catch (\Throwable $e) {

    \Log::error('Password reset SMS failed', [
        'user_id' => $user->id,
        'error' => $e->getMessage(),
    ]);

    return response()->json([
        'success' => false,
        'message' => 'Unable to send OTP SMS.',
        'error' => $e->getMessage(),
    ], 500);
}


        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your registered email.',
            'method' => 'email',
            'expires_in' => 300,
        ]);
    }



    if ($request->method === 'mobile') {

        try {

            $phone = $user->phone;

            
            if (strlen($phone) === 10) {
                $phone = '+91' . $phone;
            }

            $twilio = new \Twilio\Rest\Client(
                env('TWILIO_SID'),
                env('TWILIO_AUTH_TOKEN')
            );

            $twilio->messages->create(
                $phone,
                [
                    'from' => env('TWILIO_PHONE_NUMBER'),
                    'body' =>
                        "Your Payroll password reset OTP is {$otp}. "
                        . "This OTP will expire in 5 minutes.",
                ]
            );

        } catch (\Throwable $e) {

            PasswordResetOtp::where(
                'adduser_id',
                $user->id
            )->delete();

            \Log::error('Password reset SMS failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to send OTP SMS.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your registered mobile.',
            'method' => 'mobile',
            'expires_in' => 300,
        ]);
    }
}

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string'],
            'otp' => ['required', 'digits:6'],
        ]);

        $user = AddUser::where(
            'username',
            trim($request->username)
        )->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username.',
            ], 404);
        }

        $reset = PasswordResetOtp::where(
            'adduser_id',
            $user->id
        )->latest()
            ->first();

        if (!$reset) {
            return response()->json([
                'success' => false,
                'message' => 'OTP not found. Please request a new OTP.',
            ], 400);
        }

        if ($reset->verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'OTP has already been used.',
            ], 400);
        }

        if (now()->greaterThan($reset->expires_at)) {

            $reset->delete();

            return response()->json([
                'success' => false,
                'message' => 'OTP has expired. Please request a new OTP.',
            ], 400);
        }

        if ($reset->attempts >= 5) {

            $reset->delete();

            return response()->json([
                'success' => false,
                'message' => 'Too many incorrect attempts. Please request a new OTP.',
            ], 429);
        }


        if (!Hash::check($request->otp, $reset->otp)) {

            $reset->increment('attempts');

            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP.',
            ], 400);
        }

  

        $resetToken = Str::random(64);

        $reset->update([
            'reset_token' => Hash::make($resetToken),
            'verified_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully.',
            'reset_token' => $resetToken,
        ]);
    }


   
    public function resetPassword(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string'],
            'reset_token' => ['required', 'string'],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user = AddUser::where(
            'username',
            trim($request->username)
        )->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $reset = PasswordResetOtp::where(
            'adduser_id',
            $user->id
        )
            ->whereNotNull('verified_at')
            ->latest()
            ->first();

        if (!$reset) {
            return response()->json([
                'success' => false,
                'message' => 'Password reset authorization not found.',
            ], 400);
        }

        if (now()->greaterThan($reset->expires_at)) {

            $reset->delete();

            return response()->json([
                'success' => false,
                'message' => 'Reset session has expired. Please start again.',
            ], 400);
        }

        if (
            !$reset->reset_token ||
            !Hash::check(
                $request->reset_token,
                $reset->reset_token
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid reset token.',
            ], 400);
        }

     

        $user->password = Hash::make(
            $request->password
        );

        $user->save();

      
        $reset->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password has been reset successfully.',
        ]);
    }
}