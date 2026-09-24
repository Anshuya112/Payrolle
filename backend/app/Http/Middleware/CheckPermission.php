<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(
        Request $request,
        Closure $next,
        string $module,
        string $action
    ): Response {

        $user =
            $request->user();

        if (!$user) {

            return response()->json([
                'success' => false,
                'message' =>
                    'Unauthenticated.',
            ], 401);
        }

        $user->load(
            'roles.permissions'
        );

        $allowed = false;

        foreach ($user->roles as $role) {

            foreach (
                $role->permissions
                as $permission
            ) {

                if (
                    $permission->hasPermission(
                        $module,
                        $action
                    )
                ) {

                    $allowed = true;

                    break 2;
                }
            }
        }

        if (!$allowed) {

            return response()->json([
                'success' => false,
                'message' =>
                    'You do not have permission to perform this action.',
            ], 403);
        }

        return $next($request);
    }
}
