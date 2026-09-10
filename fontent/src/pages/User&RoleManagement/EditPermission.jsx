import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./User.css";

import {
  getToken,
  isAuthenticated,
} from "../../utils/auth";

const API_BASE = "http://127.0.0.1:8000/api";

const MODULES = [
  "Dashboard",
  "Employees",
  "Leave",
  "Salary",
  "Payroll",
  "Attendance",
  "Departments",
  "Designations",
  "Loan",
  "Payslip",
  "Reports",
  "Tax",
  "User & Role",
  "Settings",
];

const ACTIONS = [
  {
    key: "view",
    label: "View",
    icon: "👁",
    color: "blue",
    description: "View records and information",
  },
  {
    key: "create",
    label: "Create",
    icon: "+",
    color: "green",
    description: "Create new records",
  },
  {
    key: "edit",
    label: "Edit",
    icon: "✎",
    color: "purple",
    description: "Update existing records",
  },
  {
    key: "delete",
    label: "Delete",
    icon: "🗑",
    color: "red",
    description: "Delete records",
  },
  {
    key: "approve",
    label: "Approve",
    icon: "✓",
    color: "orange",
    description: "Approve requests",
  },
  {
    key: "export",
    label: "Export",
    icon: "↓",
    color: "blue",
    description: "Export records and reports",
  },
];

const getDefaultActions = () => ({
  view: false,
  create: false,
  edit: false,
  delete: false,
  approve: false,
  export: false,
});

export default function EditPermission() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    roleName: "",
    permissionName: "",
    description: "",
    status: "Active",
    modules: [],
  });

  const [moduleActions, setModuleActions] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD EXISTING PERMISSION
  // =====================================================

  useEffect(() => {
    const loadPermission = async () => {
      try {
        setLoading(true);

        // -------------------------------------------------
        // CHECK AUTHENTICATION
        // -------------------------------------------------

        if (!isAuthenticated()) {
          alert("Your session has expired. Please log in again.");
          navigate("/login");
          return;
        }

        // -------------------------------------------------
        // GET TOKEN
        // -------------------------------------------------

        const token = getToken();

        if (!token) {
          alert("Authentication token not found. Please log in again.");
          navigate("/login");
          return;
        }

        // -------------------------------------------------
        // GET PERMISSION
        // -------------------------------------------------

        const response = await fetch(
          `${API_BASE}/permissions/${id}`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        // -------------------------------------------------
        // HANDLE UNAUTHORIZED
        // -------------------------------------------------

        if (response.status === 401) {
          alert("Your session has expired. Please log in again.");

          navigate("/login");
          return;
        }

        // -------------------------------------------------
        // HANDLE OTHER ERRORS
        // -------------------------------------------------

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Unable to load permission"
          );
        }

        // -------------------------------------------------
        // NORMALIZE API RESPONSE
        // -------------------------------------------------

        const permission =
          data.permission ||
          data.data ||
          data;

        if (!permission) {
          throw new Error("Permission not found");
        }

        // -------------------------------------------------
        // EXISTING MODULES
        // -------------------------------------------------

        const existingModules = Array.isArray(
          permission.modules
        )
          ? permission.modules
          : [];

        // -------------------------------------------------
        // SELECTED MODULE NAMES
        // -------------------------------------------------

        const selectedModules = existingModules
          .map((item) => {
            if (typeof item === "string") {
              return item;
            }

            return item?.module;
          })
          .filter(Boolean);

        // -------------------------------------------------
        // MODULE-WISE ACTIONS
        // -------------------------------------------------

        const existingActions = {};

        existingModules.forEach((item) => {
          // Backend may return module as string
          if (typeof item === "string") {
            existingActions[item] =
              getDefaultActions();

            return;
          }

          const moduleName = item?.module;

          if (!moduleName) {
            return;
          }

          existingActions[moduleName] = {
            ...getDefaultActions(),
            ...(item.actions || {}),
          };
        });

        // -------------------------------------------------
        // SET BASIC INFORMATION
        // -------------------------------------------------

        setFormData({
          roleName:
            permission.role_name ??
            permission.roleName ??
            permission.role?.name ??
            "",

          permissionName:
            permission.permissionName ??
            permission.permission_name ??
            permission.name ??
            "",

          description:
            permission.description ?? "",

          status:
            permission.status ?? "Active",

          modules: selectedModules,
        });

        // -------------------------------------------------
        // RESTORE SELECTED ACTIONS
        // -------------------------------------------------

        setModuleActions(existingActions);

      } catch (error) {
        console.error(
          "Permission loading error:",
          error
        );

        alert(
          error.message ||
            "Unable to load permission"
        );

        navigate("/permissions");

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPermission();
    } else {
      setLoading(false);

      alert("Invalid permission ID.");

      navigate("/permissions");
    }
  }, [id, navigate]);

  // =====================================================
  // BASIC CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =====================================================
  // MODULE CHANGE
  // =====================================================

  const handleModuleChange = (module) => {
    const alreadySelected =
      formData.modules.includes(module);

    if (alreadySelected) {
      // -------------------------------------------------
      // REMOVE MODULE
      // -------------------------------------------------

      setFormData((prev) => ({
        ...prev,

        modules: prev.modules.filter(
          (item) => item !== module
        ),
      }));

      setModuleActions((prev) => {
        const updated = {
          ...prev,
        };

        delete updated[module];

        return updated;
      });

    } else {
      // -------------------------------------------------
      // ADD MODULE
      // -------------------------------------------------

      setFormData((prev) => ({
        ...prev,

        modules: [
          ...prev.modules,
          module,
        ],
      }));

      setModuleActions((prev) => ({
        ...prev,

        [module]:
          prev[module] ||
          getDefaultActions(),
      }));
    }

    setErrors((prev) => ({
      ...prev,
      modules: "",
    }));
  };

  // =====================================================
  // ACTION CHANGE
  // =====================================================

  const handleActionChange = (
    module,
    action
  ) => {
    setModuleActions((prev) => ({
      ...prev,

      [module]: {
        ...(prev[module] ||
          getDefaultActions()),

        [action]:
          !(prev[module]?.[action] || false),
      },
    }));

    setErrors((prev) => ({
      ...prev,
      actions: "",
    }));
  };

  // =====================================================
  // SELECT ALL MODULES
  // =====================================================

  const selectAllModules = () => {
    const allSelected =
      formData.modules.length ===
      MODULES.length;

    if (allSelected) {
      setFormData((prev) => ({
        ...prev,
        modules: [],
      }));

      setModuleActions({});

      setErrors((prev) => ({
        ...prev,
        modules: "",
      }));

      return;
    }

    const allActions = {};

    MODULES.forEach((module) => {
      allActions[module] =
        moduleActions[module] ||
        getDefaultActions();
    });

    setFormData((prev) => ({
      ...prev,
      modules: [...MODULES],
    }));

    setModuleActions(allActions);

    setErrors((prev) => ({
      ...prev,
      modules: "",
    }));
  };

  // =====================================================
  // SELECT ALL ACTIONS
  // =====================================================

  const selectAllActions = (module) => {
    const current =
      moduleActions[module] ||
      getDefaultActions();

    const allSelected =
      ACTIONS.every(
        (action) =>
          current[action.key]
      );

    const updatedActions = {};

    ACTIONS.forEach((action) => {
      updatedActions[action.key] =
        !allSelected;
    });

    setModuleActions((prev) => ({
      ...prev,

      [module]:
        updatedActions,
    }));

    setErrors((prev) => ({
      ...prev,
      actions: "",
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    const newErrors = {};

    // -------------------------------------------------
    // PERMISSION NAME
    // -------------------------------------------------

    if (!formData.permissionName.trim()) {
      newErrors.permissionName =
        "Permission name is required";
    }

    // -------------------------------------------------
    // DESCRIPTION
    // -------------------------------------------------

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required";
    }

    // -------------------------------------------------
    // MODULE
    // -------------------------------------------------

    if (formData.modules.length === 0) {
      newErrors.modules =
        "Please select at least one module";
    }

    // -------------------------------------------------
    // ACTION
    // -------------------------------------------------

    const hasAction =
      formData.modules.some(
        (module) =>
          Object.values(
            moduleActions[module] ||
              getDefaultActions()
          ).some(Boolean)
      );

    if (!hasAction) {
      newErrors.actions =
        "Select at least one action";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =====================================================
  // UPDATE PERMISSION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      // -------------------------------------------------
      // CHECK AUTHENTICATION
      // -------------------------------------------------

      if (!isAuthenticated()) {
        alert(
          "Your session has expired. Please log in again."
        );

        navigate("/login");

        return;
      }

      // -------------------------------------------------
      // GET TOKEN
      // -------------------------------------------------

      const token = getToken();

      if (!token) {
        alert(
          "Authentication token not found. Please log in again."
        );

        navigate("/login");

        return;
      }

      // -------------------------------------------------
      // PREPARE MODULES
      // -------------------------------------------------

      const modules =
        formData.modules.map(
          (module) => ({
            module,

            actions:
              moduleActions[module] ||
              getDefaultActions(),
          })
        );

      // -------------------------------------------------
      // UPDATE API
      // -------------------------------------------------

      const response =
        await fetch(
          `${API_BASE}/permissions/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              role_name:
                formData.roleName,

              name:
                formData.permissionName.trim(),

              description:
                formData.description.trim(),

              status:
                formData.status,

              modules,
            }),
          }
        );

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      // -------------------------------------------------
      // HANDLE UNAUTHORIZED
      // -------------------------------------------------

      if (response.status === 401) {
        alert(
          "Your session has expired. Please log in again."
        );

        navigate("/login");

        return;
      }

      // -------------------------------------------------
      // HANDLE VALIDATION ERRORS
      // -------------------------------------------------

      if (!response.ok) {
        if (data.errors) {
          const backendErrors = {};

          Object.keys(
            data.errors
          ).forEach((key) => {
            backendErrors[key] =
              Array.isArray(
                data.errors[key]
              )
                ? data.errors[key][0]
                : data.errors[key];
          });

          setErrors(
            backendErrors
          );
        }

        throw new Error(
          data.message ||
            data.error ||
            "Unable to update permission"
        );
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      alert(
        "Permission updated successfully."
      );

      navigate("/permissions");

    } catch (error) {
      console.error(
        "Permission update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update permission"
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="add-user-page">

        <div className="form-card">

          <h2>
            Loading permission...
          </h2>

          <p>
            Please wait...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="add-user-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="add-user-header">

        <div>

          <div className="breadcrumb-small">

            <span
              onClick={() =>
                navigate("/permissions")
              }
              style={{
                cursor: "pointer",
              }}
            >
              Permissions
            </span>

            <b>/</b>

            <strong>
              Edit Permission
            </strong>

          </div>

          <h1>
            Edit Permission
          </h1>

          <p>
            Update permission modules
            and their allowed actions.
          </p>

        </div>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="user-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-section-icon blue">
              🔐
            </div>

            <div>

              <h2>
                Role & Permission
              </h2>

              <p>
                Update permission information.
              </p>

            </div>

          </div>

          <div className="form-grid">

            {/* ROLE */}

            <div className="form-group">

              <label>
                Role Name
              </label>

              <input
                type="text"
                value={
                  formData.roleName
                }
                readOnly
              />

            </div>

            {/* PERMISSION NAME */}

            <div className="form-group">

              <label>
                Permission Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="permissionName"
                value={
                  formData.permissionName
                }
                onChange={handleChange}
                className={
                  errors.permissionName
                    ? "input-error"
                    : ""
                }
              />

              {errors.permissionName && (
                <small className="error-text">
                  {
                    errors.permissionName
                  }
                </small>
              )}

            </div>

            {/* DESCRIPTION */}

            <div
              className="form-group"
              style={{
                gridColumn: "1 / -1",
              }}
            >

              <label>
                Description
                <span>*</span>
              </label>

              <textarea
                name="description"
                rows="4"
                value={
                  formData.description
                }
                onChange={handleChange}
                className={
                  errors.description
                    ? "input-error"
                    : ""
                }
              />

              {errors.description && (
                <small className="error-text">
                  {
                    errors.description
                  }
                </small>
              )}

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* =================================================
            SELECT MODULES
        ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-section-icon purple">
              📦
            </div>

            <div>

              <h2>
                Select Modules
              </h2>

              <p>
                Modules selected in Add Permission
                are automatically selected here.
              </p>

            </div>

            <button
              type="button"
              className="select-all-btn"
              onClick={selectAllModules}
            >
              {formData.modules.length ===
              MODULES.length
                ? "Clear All"
                : "Select All"}
            </button>

          </div>

          {/* MODULE CARDS */}

          <div className="module-selection-grid">

            {MODULES.map(
              (module) => {

                const selected =
                  formData.modules.includes(
                    module
                  );

                return (

                  <label
                    key={module}
                    className={`module-select-card ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        handleModuleChange(
                          module
                        )
                      }
                    />

                    <span className="module-select-icon">
                      📁
                    </span>

                    <span className="module-select-name">
                      {module}
                    </span>

                    {selected && (
                      <span className="module-selected-check">
                        ✓
                      </span>
                    )}

                  </label>

                );
              }
            )}

          </div>

          {errors.modules && (
            <small className="error-text">
              {errors.modules}
            </small>
          )}

        </div>

        {/* =================================================
            SELECTED MODULE PERMISSIONS
        ================================================= */}

        {formData.modules.length > 0 && (

          <div className="form-card">

            <div className="form-card-header">

              <div className="form-section-icon orange">
                ⚙️
              </div>

              <div>

                <h2>
                  Module Permissions
                </h2>

                <p>
                  Existing actions from Add
                  Permission are already selected.
                </p>

              </div>

            </div>

            <div className="selected-module-permissions">

              {formData.modules.map(
                (module) => {

                  const actions =
                    moduleActions[module] ||
                    getDefaultActions();

                  const selectedCount =
                    Object.values(
                      actions
                    ).filter(Boolean).length;

                  return (

                    <div
                      className="selected-module-card"
                      key={module}
                    >

                      {/* MODULE HEADER */}

                      <div className="selected-module-header">

                        <div className="selected-module-title">

                          <div className="selected-module-icon">
                            📁
                          </div>

                          <div>

                            <h3>
                              {module}
                            </h3>

                            <span>
                              {selectedCount} of{" "}
                              {ACTIONS.length}{" "}
                              actions selected
                            </span>

                          </div>

                        </div>

                        <button
                          type="button"
                          className="select-module-actions-btn"
                          onClick={() =>
                            selectAllActions(
                              module
                            )
                          }
                        >
                          {selectedCount ===
                          ACTIONS.length
                            ? "Clear Actions"
                            : "Select All Actions"}
                        </button>

                      </div>

                      {/* ACTIONS */}

                      <div className="permission-action-grid">

                        {ACTIONS.map(
                          (action) => {

                            const checked =
                              !!actions[
                                action.key
                              ];

                            return (

                              <label
                                key={
                                  action.key
                                }
                                className={`action-card ${
                                  checked
                                    ? "selected"
                                    : ""
                                }`}
                              >

                                <input
                                  type="checkbox"
                                  checked={
                                    checked
                                  }
                                  onChange={() =>
                                    handleActionChange(
                                      module,
                                      action.key
                                    )
                                  }
                                />

                                <div
                                  className={`action-icon ${action.color}`}
                                >
                                  {
                                    action.icon
                                  }
                                </div>

                                <div>

                                  <strong>
                                    {
                                      action.label
                                    }
                                  </strong>

                                  <span>
                                    {
                                      action.description
                                    }
                                  </span>

                                </div>

                              </label>

                            );
                          }
                        )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

            {errors.actions && (
              <small className="error-text">
                {errors.actions}
              </small>
            )}

          </div>

        )}

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/permissions")
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-user-btn"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "✓ Update Permission"}
          </button>

        </div>

      </form>

    </div>
  );
}
