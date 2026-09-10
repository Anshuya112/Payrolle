import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  isAuthenticated,
} from "../../utils/auth";

export default function AuthSync() {
  const navigate =
    useNavigate();

  useEffect(() => {
    console.log(
      "🔄 [AUTH-SYNC] AuthSync mounted"
    );

    /*
    |--------------------------------------------------------------------------
    | STORAGE EVENT
    |--------------------------------------------------------------------------
    */

    const handleStorageChange =
      (event) => {
        console.log(
          "📢 [AUTH-SYNC] Storage event:",
          event.key
        );

        /*
        |--------------------------------------------------------------------------
        | LOGOUT
        |--------------------------------------------------------------------------
        */

        if (
          event.key ===
          "payroll_logout"
        ) {
          console.log(
            "🚪 [AUTH-SYNC] Logout event detected"
          );

          if (!isAuthenticated()) {
            console.log(
              "↪️ [AUTH-SYNC] Redirecting to login"
            );

            navigate(
              "/login",
              {
                replace: true,
                state: {
                  sessionExpired:
                    true,
                },
              }
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | AUTH CHANGE
        |--------------------------------------------------------------------------
        */

        if (
          event.key ===
          "payroll_auth"
        ) {
          console.log(
            "🔐 [AUTH-SYNC] payroll_auth changed"
          );
        }
      };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /*
    |--------------------------------------------------------------------------
    | CLEANUP
    |--------------------------------------------------------------------------
    */

    return () => {
      console.log(
        "🧹 [AUTH-SYNC] Removing storage listener"
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [navigate]);

  return null;
}
