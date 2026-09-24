import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { isAuthenticated } from "../../utils/auth";
import { usePermission } from "../context/PermissionContext";

export default function ProtectedRoute({
  children,
  permission = null,
}) {
  const location = useLocation();

  const {
    loading,
    permissions,
    hasPermissionString,
    error,
  } = usePermission();

 
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

 

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "10px",
          fontSize: "18px",
        }}
      >
        <div>
          Checking permissions...
        </div>

        <small>
          Please wait
        </small>
      </div>
    );
  }

  

  if (!permission) {
    return children;
  }

 
  const allowed =
    hasPermissionString(
      permission
    );

  console.log(
    "="
  );

  console.log(
    "PROTECTED ROUTE"
  );

  console.log(
    "Path:",
    location.pathname
  );

  console.log(
    "Required:",
    permission
  );

  console.log(
    "Allowed:",
    allowed
  );

  console.log(
    "Permissions:",
    permissions
  );

  console.log(
    "="
  );

 

  if (!allowed) {
    console.warn(
      "ACCESS DENIED",
      {
        path: location.pathname,
        permission,
        permissions,
        error,
      }
    );

    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          accessDenied: true,
          permission,
          attemptedPath:
            location.pathname,
        }}
      />
    );
  }

 

  return children;
}
