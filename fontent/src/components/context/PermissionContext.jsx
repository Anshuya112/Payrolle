import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getToken,
  isAuthenticated,
} from "../../utils/auth";

const API_BASE = "http://127.0.0.1:8000/api";

const PermissionContext =
  createContext(null);

function toBoolean(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    String(value).toLowerCase() === "true" ||
    String(value).toLowerCase() === "yes"
  );
}

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function normalizePermissions(rawPermissions) {
  const result = {};

  if (
    !rawPermissions ||
    typeof rawPermissions !== "object"
  ) {
    return result;
  }

  if (Array.isArray(rawPermissions)) {
    rawPermissions.forEach((item) => {
      if (typeof item === "string") {
        const parts = item
          .trim()
          .toLowerCase()
          .split(".");

        if (parts.length !== 2) {
          return;
        }

        const module = normalizeName(parts[0]);
        const action = normalizeName(parts[1]);

        if (!module || !action) {
          return;
        }

        if (!result[module]) {
          result[module] = {};
        }

        result[module][action] = true;

        return;
      }

      if (
        !item ||
        typeof item !== "object"
      ) {
        return;
      }

      const moduleName =
        item.module ||
        item.module_name ||
        item.moduleName ||
        item.resource ||
        item.resource_name ||
        item.name;

      if (!moduleName) {
        return;
      }

      const module =
        normalizeName(moduleName);

      if (!result[module]) {
        result[module] = {};
      }

      if (
        item.actions &&
        typeof item.actions === "object" &&
        !Array.isArray(item.actions)
      ) {
        Object.entries(
          item.actions
        ).forEach(
          ([action, value]) => {
            result[module][
              normalizeName(action)
            ] = toBoolean(value);
          }
        );
      }

      if (
        Array.isArray(item.permissions)
      ) {
        item.permissions.forEach(
          (permission) => {
            if (
              typeof permission ===
              "string"
            ) {
              result[module][
                normalizeName(permission)
              ] = true;
            }

            if (
              permission &&
              typeof permission ===
                "object"
            ) {
              const action =
                permission.name ||
                permission.action ||
                permission.permission;

              if (action) {
                result[module][
                  normalizeName(action)
                ] = true;
              }
            }
          }
        );
      }

      [
        "view",
        "create",
        "edit",
        "update",
        "delete",
        "approve",
        "export",
        "download",
        "history",
        "allowances",
        "deductions",
        "payment",
        "login",
        "dashboard",
        "company",
        "payroll",
        "system",
      ].forEach((action) => {
        if (
          Object.prototype.hasOwnProperty.call(
            item,
            action
          )
        ) {
          result[module][action] =
            toBoolean(item[action]);
        }
      });
    });

    return result;
  }

  Object.entries(
    rawPermissions
  ).forEach(
    ([moduleName, moduleData]) => {
      const module =
        normalizeName(moduleName);

      if (!module) {
        return;
      }

      if (!result[module]) {
        result[module] = {};
      }

      if (
        !moduleData ||
        typeof moduleData !==
          "object"
      ) {
        return;
      }

      const actions =
        moduleData.actions &&
        typeof moduleData.actions ===
          "object" &&
        !Array.isArray(
          moduleData.actions
        )
          ? moduleData.actions
          : moduleData;

      Object.entries(actions).forEach(
        ([actionName, value]) => {
          if (
            [
              "module",
              "name",
              "actions",
              "permissions",
            ].includes(actionName)
          ) {
            return;
          }

          result[module][
            normalizeName(actionName)
          ] = toBoolean(value);
        }
      );

      if (
        Array.isArray(
          moduleData.permissions
        )
      ) {
        moduleData.permissions.forEach(
          (permission) => {
            if (
              typeof permission ===
              "string"
            ) {
              result[module][
                normalizeName(permission)
              ] = true;
            }

            if (
              permission &&
              typeof permission ===
                "object"
            ) {
              const action =
                permission.name ||
                permission.action ||
                permission.permission;

              if (action) {
                result[module][
                  normalizeName(action)
                ] = true;
              }
            }
          }
        );
      }
    }
  );

  return result;
}

export function PermissionProvider({
  children,
}) {
  const [permissions, setPermissions] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadPermissions =
    useCallback(async () => {
      const token = getToken();

      console.log(
        "PERMISSION LOAD START",
        {
          token: Boolean(token),
          authenticated:
            isAuthenticated(),
        }
      );

      if (
        !token ||
        !isAuthenticated()
      ) {
        setPermissions({});
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE}/my-permissions`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

    const text = await response.text();

console.log("Permission API Status:", response.status);
console.log("Permission API RAW:", text);

let data = {};

try {
  data = text ? JSON.parse(text) : {};
} catch (error) {
  throw new Error(
    `Permission API returned invalid JSON. HTTP ${response.status}. Response: ${text.slice(0, 500)}`
  );
}

if (response.status === 401) {
  localStorage.removeItem("payroll_auth");
  localStorage.removeItem("payroll_user");

  setPermissions({});
  setError("Session expired. Please login again.");

  window.dispatchEvent(
    new Event("payroll-auth-changed")
  );

  return;
}

if (!response.ok) {
  throw new Error(
    data?.message ||
    data?.error ||
    `Permission API error: ${response.status}`
  );
}

        let rawPermissions = {};

        if (
          data?.permissions !==
          undefined
        ) {
          rawPermissions =
            data.permissions;
        } else if (
          data?.data?.permissions !==
          undefined
        ) {
          rawPermissions =
            data.data.permissions;
        } else if (
          Array.isArray(data?.data)
        ) {
          rawPermissions =
            data.data;
        } else if (
          Array.isArray(data)
        ) {
          rawPermissions = data;
        } else {
          rawPermissions = data;
        }

        console.log(
          " RAW PERMISSIONS:",
          rawPermissions
        );

        const normalized =
          normalizePermissions(
            rawPermissions
          );

        console.log(
          "NORMALIZED PERMISSIONS:",
          normalized
        );

        setPermissions(normalized);
        setError("");
      } catch (err) {
        console.error(
          " PERMISSION LOAD ERROR:",
          err
        );

        setPermissions({});

        setError(
          err?.message ||
            "Unable to load permissions."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  useEffect(() => {
    const handleAuthChanged =
      () => {
        console.log(
          " Authentication changed"
        );

        loadPermissions();
      };

    window.addEventListener(
      "payroll-auth-changed",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "payroll-auth-changed",
        handleAuthChanged
      );
    };
  }, [loadPermissions]);

  const hasPermission =
    useCallback(
      (module, action = "view") => {
        if (!module || !action) {
          return false;
        }

        const moduleName =
          normalizeName(module);

        const actionName =
          normalizeName(action);

        const modulePermissions =
          permissions?.[
            moduleName
          ];

        const result =
          modulePermissions?.[
            actionName
          ] === true;

        console.log(
          "🔎 PERMISSION CHECK:",
          {
            requested:
              `${moduleName}.${actionName}`,
            result,
            modulePermissions,
          }
        );

        return result;
      },
      [permissions]
    );

  const hasPermissionString =
    useCallback(
      (permissionString) => {
        if (
          !permissionString ||
          typeof permissionString !==
            "string"
        ) {
          return false;
        }

        const parts =
          permissionString
            .split(".")
            .map((item) =>
              item
                .trim()
                .toLowerCase()
            );

        if (parts.length !== 2) {
          return false;
        }

        return hasPermission(
          parts[0],
          parts[1]
        );
      },
      [hasPermission]
    );

  const hasAnyPermission =
    useCallback(
      (module, actions = []) => {
        if (
          !Array.isArray(actions)
        ) {
          return false;
        }

        return actions.some(
          (action) =>
            hasPermission(
              module,
              action
            )
        );
      },
      [hasPermission]
    );

  const hasAllPermissions =
    useCallback(
      (module, actions = []) => {
        if (
          !Array.isArray(actions)
        ) {
          return false;
        }

        return actions.every(
          (action) =>
            hasPermission(
              module,
              action
            )
        );
      },
      [hasPermission]
    );

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        loading,
        error,
        reloadPermissions:
          loadPermissions,
        hasPermission,
        hasPermissionString,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const context =
    useContext(
      PermissionContext
    );

  if (!context) {
    throw new Error(
      "usePermission must be used inside PermissionProvider"
    );
  }

  return context;
}

export function usePermissions() {
  return usePermission();
}
