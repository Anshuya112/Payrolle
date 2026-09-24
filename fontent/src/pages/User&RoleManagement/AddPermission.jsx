import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./User.css";

import { getToken } from "../../utils/auth";

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
    description:
      "View records and information",
  },
  {
    key: "create",
    label: "Create",
    icon: "+",
    color: "green",
    description:
      "Create new records",
  },
  {
    key: "edit",
    label: "Edit",
    icon: "✎",
    color: "purple",
    description:
      "Update existing records",
  },
  {
    key: "delete",
    label: "Delete",
    icon: "🗑",
    color: "red",
    description:
      "Delete records",
  },
  {
    key: "approve",
    label: "Approve",
    icon: "✓",
    color: "orange",
    description:
      "Approve requests",
  },
  {
    key: "export",
    label: "Export",
    icon: "↓",
    color: "blue",
    description:
      "Export records and reports",
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

export default function AddPermission() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);

  const [loadingRoles, setLoadingRoles] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] = useState({
    roleName: "",
    permissionName: "",
    description: "",
    status: "Active",
    modules: [],
  });

  const [moduleActions, setModuleActions] =
    useState({});

  const [errors, setErrors] =
    useState({});

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);

       const token = getToken();

if (!token) {
  throw new Error(
    "Authentication token not found. Please login again."
  );
}

const response = await fetch(
  `${API_BASE}/roles`,
  {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);


        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load roles"
          );
        }

        setRoles(
          data.roles || []
        );

      } catch (error) {
        console.error(
          "Role loading error:",
          error
        );

        setErrors({
          roleName:
            error.message ||
            "Unable to load roles",
        });

      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

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

  const handleRoleChange = (e) => {
    const roleName =
      e.target.value;

    setFormData((prev) => ({
      ...prev,
      roleName,
      permissionName: roleName,
    }));

    setErrors((prev) => ({
      ...prev,
      roleName: "",
      permissionName: "",
    }));
  };
  const handlePermissionNameChange = (
    e
  ) => {
    const value =
      e.target.value;

    setFormData((prev) => ({
      ...prev,
      permissionName: value,
    }));

    setErrors((prev) => ({
      ...prev,
      permissionName: "",
    }));
  };

  const handleModuleChange = (
    module
  ) => {
    const alreadySelected =
      formData.modules.includes(
        module
      );

    if (alreadySelected) {
      // Remove module
      setFormData((prev) => ({
        ...prev,
        modules:
          prev.modules.filter(
            (item) =>
              item !== module
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
      // Add module
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
          getDefaultActions(),
      }));
    }

    setErrors((prev) => ({
      ...prev,
      modules: "",
    }));
  };

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

      return;
    }

    const actions = {};

    MODULES.forEach((module) => {
      actions[module] =
        getDefaultActions();
    });

    setFormData((prev) => ({
      ...prev,
      modules: [
        ...MODULES,
      ],
    }));

    setModuleActions(actions);

    setErrors((prev) => ({
      ...prev,
      modules: "",
    }));
  };


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
          !prev[module]?.[action],
      },
    }));

    setErrors((prev) => ({
      ...prev,
      actions: "",
    }));
  };

  

  const selectAllActions = (
    module
  ) => {
    const current =
      moduleActions[module] ||
      getDefaultActions();

    const allSelected =
      Object.values(
        current
      ).every(Boolean);

    const updatedActions = {};

    ACTIONS.forEach((action) => {
      updatedActions[
        action.key
      ] = !allSelected;
    });

    setModuleActions((prev) => ({
      ...prev,

      [module]:
        updatedActions,
    }));
  };


  const validate = () => {
    const newErrors = {};


    if (!formData.roleName) {
      newErrors.roleName =
        "Please select a role";
    }


    if (
      !formData.permissionName.trim()
    ) {
      newErrors.permissionName =
        "Permission name is required";
    }


    if (
      formData.roleName &&
      formData.permissionName.trim() &&
      formData.roleName.trim() !==
        formData.permissionName.trim()
    ) {
      newErrors.permissionName =
        "Permission name must be exactly the same as the role name";
    }


    if (
      !formData.description.trim()
    ) {
      newErrors.description =
        "Description is required";
    }


    if (
      formData.modules.length === 0
    ) {
      newErrors.modules =
        "Please select at least one module";
    }


    const hasAction =
      formData.modules.some(
        (module) =>
          Object.values(
            moduleActions[
              module
            ] || {}
          ).some(Boolean)
      );

    if (!hasAction) {
      newErrors.actions =
        "Select at least one action";
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("==");
  console.log("[ADD-PERMISSION] Submit started");

  if (!validate()) {
    console.error("[ADD-PERMISSION] Validation failed");
    return;
  }

  try {
    setSaving(true);

    const token = getToken();

    if (!token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    const modules = formData.modules.map((module) => ({
      module,
      actions:
        moduleActions[module] ||
        getDefaultActions(),
    }));

    console.log(
      "[ADD-PERMISSION] Form data:",
      formData
    );

    console.log(
      "[ADD-PERMISSION] Modules:",
      modules
    );

    const payload = {
      role_name: formData.roleName,
      name: formData.permissionName.trim(),
      description: formData.description.trim(),
      status: formData.status,
      modules,
    };

    console.log(
      "[ADD-PERMISSION] Sending payload:",
      payload
    );

    const response = await fetch(
      `${API_BASE}/permissions`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      }
    );

    console.log(
      "[ADD-PERMISSION] API status:",
      response.status
    );

    const data = await response.json();

    console.log(
      "[ADD-PERMISSION] API response:",
      data
    );

    if (!response.ok) {
      console.error(
        "[ADD-PERMISSION] API failed:",
        data
      );

      if (data.errors) {
        const backendErrors = {};

        Object.keys(data.errors).forEach((key) => {
          backendErrors[key] = Array.isArray(
            data.errors[key]
          )
            ? data.errors[key][0]
            : data.errors[key];
        });

        setErrors(backendErrors);
      }

      throw new Error(
        data.message ||
          "Unable to create permission"
      );
    }

    console.log(
      "[ADD-PERMISSION] Permission created successfully"
    );

    alert("Permission created successfully.");

    navigate("/Permission");

  } catch (error) {
    console.error(
      "[ADD-PERMISSION] Creation error:",
      error
    );

    alert(
      error.message ||
        "Unable to create permission"
    );

  } finally {
    setSaving(false);

    console.log(
      "[ADD-PERMISSION] Submit finished"
    );
  }
};



  return (
    <div className="add-user-page">

      <div className="add-user-header">

        <div>

          <div className="breadcrumb-small">

            <span
              onClick={() =>
                navigate(
                  "/permissions"
                )
              }
              style={{
                cursor:
                  "pointer",
              }}
            >
              Permissions
            </span>

            <b>/</b>

            <strong>
              Add Permission
            </strong>

          </div>

          <h1>
            Add Permission
          </h1>

          <p>
            Create a permission for a
            role and define its module
            actions.
          </p>

        </div>

      </div>


      <form
        className="user-form"
        onSubmit={
          handleSubmit
        }
      >
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
                Select an existing role.
                Permission name must match
                the role name.
              </p>

            </div>

          </div>


          <div className="form-grid">

            <div className="form-group">

              <label>
                Role Name
                <span>*</span>
              </label>

              {loadingRoles ? (

                <select disabled>
                  <option>
                    Loading roles...
                  </option>
                </select>

              ) : (

                <select
                  name="roleName"
                  value={
                    formData.roleName
                  }
                  onChange={
                    handleRoleChange
                  }
                  className={
                    errors.roleName
                      ? "input-error"
                      : ""
                  }
                >

                  <option value="">
                    Select role
                  </option>

                  {roles.map(
                    (role) => (

                      <option
                        key={
                          role.id
                        }
                        value={
                          role.name
                        }
                      >
                        {role.name}
                      </option>

                    )
                  )}

                </select>

              )}

              {errors.roleName && (

                <small className="error-text">
                  {
                    errors.roleName
                  }
                </small>

              )}

            </div>

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
                onChange={
                  handlePermissionNameChange
                }
                placeholder="Permission name"
                className={
                  errors.permissionName
                    ? "input-error"
                    : ""
                }
              />

              {formData.roleName && (
                <small>
                  Must match role:{" "}
                  <strong>
                    {
                      formData.roleName
                    }
                  </strong>
                </small>
              )}

              {errors.permissionName && (

                <small className="error-text">
                  {
                    errors.permissionName
                  }
                </small>

              )}

            </div>


            <div
              className="form-group"
              style={{
                gridColumn:
                  "1 / -1",
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
                onChange={
                  handleChange
                }
                placeholder="Describe what this permission allows..."
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



            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
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
                You can select multiple
                modules for this permission.
              </p>

            </div>

            <button
              type="button"
              className="select-all-btn"
              onClick={
                selectAllModules
              }
            >
              {formData.modules
                .length ===
              MODULES.length
                ? "Clear All"
                : "Select All"}
            </button>

          </div>


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
                      checked={
                        selected
                      }
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


        {formData.modules
          .length > 0 && (

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
                  Configure actions
                  separately for each
                  selected module.
                </p>

              </div>

            </div>


            <div className="selected-module-permissions">

              {formData.modules.map(
                (module) => {

                  const actions =
                    moduleActions[
                      module
                    ] ||
                    getDefaultActions();

                  const selectedCount =
                    Object.values(
                      actions
                    ).filter(
                      Boolean
                    ).length;

                  return (

                    <div
                      className="selected-module-card"
                      key={
                        module
                      }
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
                              {
                                selectedCount
                              }{" "}
                              of{" "}
                              {
                                ACTIONS.length
                              }{" "}
                              actions
                              selected
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


                      {/* ACTION CARDS */}

                      <div className="permission-action-grid">

                        {ACTIONS.map(
                          (
                            action
                          ) => {

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
                                  name={
                                    action.key
                                  }
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


        <div className="form-card access-info-card">

          <div className="access-info-icon">
            💡
          </div>

          <div>

            <h3>
              Permission Rules
            </h3>

            <p>
              A permission must belong to
              an existing role. The permission
              name must exactly match the role
              name. You can assign multiple
              modules and configure different
              actions for each module.
            </p>

          </div>

        </div>



        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(
                "/permission"
              )
            }
            disabled={saving}
          >
            Cancel
          </button>

<button
  type="submit"
  className="create-user-btn"
  disabled={saving || loadingRoles}
>
  {saving
    ? "Creating..."
    : "✓ Create Permission"}
</button>

        </div>

      </form>

    </div>
  );
}
