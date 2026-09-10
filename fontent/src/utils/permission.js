import { getUser } from "./auth";

const API_BASE = "http://127.0.0.1:8000/api";

export const getCurrentUserRole = () => {
  const user = getUser();

  if (!user) {
    return null;
  }

  return (
    user.role_name ||
    user.roleName ||
    user.role?.name ||
    user.role?.role_name ||
    null
  );
};

export const getPermissions = async () => {
  const user = getUser();

  if (!user) {
    return [];
  }

  const roleName = getCurrentUserRole();

  if (!roleName) {
    return [];
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return [];
  }

  const response = await fetch(
    `${API_BASE}/permissions`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",

        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthenticated");
    }

    throw new Error(
      "Unable to load permissions"
    );
  }

  const data = await response.json();

  const permissions =
    data.permissions ||
    data.data ||
    data;

  if (!Array.isArray(permissions)) {
    return [];
  }

  return permissions.filter((permission) => {
    const permissionRole =
      permission.role_name ||
      permission.roleName ||
      permission.role?.name ||
      "";

    return (
      permissionRole.toLowerCase() ===
      roleName.toLowerCase()
    );
  });
};
