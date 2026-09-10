const AUTH_KEY = "payroll_auth";
const LOGOUT_KEY = "payroll_logout";

export function saveLogin(data) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify(data)
  );

  window.dispatchEvent(
    new Event("payroll-auth-changed")
  );
}

export function getAuth() {
  const data = localStorage.getItem(AUTH_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Invalid auth data:", error);

    localStorage.removeItem(AUTH_KEY);

    return null;
  }
}

export function getToken() {
  const auth = getAuth();

  return (
    auth?.token ||
    auth?.access_token ||
    auth?.user?.token ||
    null
  );
}

export function getUser() {
  const auth = getAuth();

  return auth?.user || auth || null;
}

export function getRole() {
  const auth = getAuth();
  const user = auth?.user || auth;

  const role =
    auth?.role ||
    user?.role ||
    user?.role_name ||
    user?.roleName ||
    user?.role?.name ||
    user?.roles?.[0]?.name ||
    "";

  return String(role)
    .trim()
    .toLowerCase();
}

export function getRoles() {
  const auth = getAuth();
  const user = auth?.user || auth;

  if (Array.isArray(auth?.roles)) {
    return auth.roles;
  }

  if (Array.isArray(user?.roles)) {
    return user.roles;
  }

  return [];
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("payroll_user");

  localStorage.setItem(
    LOGOUT_KEY,
    Date.now().toString()
  );

  window.dispatchEvent(
    new Event("payroll-auth-changed")
  );
}

export function logoutUser() {
  logout();
}

export function getRoleDashboard() {
  return "/dashboard";
}