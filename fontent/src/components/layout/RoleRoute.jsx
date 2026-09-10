import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  getCurrentRole,
  getCurrentRoles,
  isAuthenticated,
} from "../../utils/auth";

export default function RoleRoute({
  allowedRoles = [],
}) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const currentRole =
    getCurrentRole();

  const currentRoles =
    getCurrentRoles();

  const allowed = allowedRoles.map(
    (role) =>
      String(role)
        .toLowerCase()
        .trim()
  );

  /*
   * Super Admin can access everything.
   */
  if (
    currentRoles.includes(
      "super admin"
    ) ||
    currentRoles.includes(
      "superadmin"
    )
  ) {
    return <Outlet />;
  }

  /*
   * Multiple roles support
     
   */
  const hasPermission =
    allowed.some((role) =>
      currentRoles.includes(role)
    ) ||
    allowed.includes(currentRole);

  if (!hasPermission) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }


  return <Outlet />;
}
