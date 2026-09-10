import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";

import { apiFetch } from "../../utils/api";



const API_BASE = "http://127.0.0.1:8000/api";

export default function AddUser() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    roles: [],
    employeeId: "",

    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    department: "",
    designation: "",

    username: "",
    password: "",
    confirmPassword: "",

    status: "Active",
    sendWelcomeEmail: true,
  });

  const [errors, setErrors] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Load Employees + Roles
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Fetch Employees
  |--------------------------------------------------------------------------
  */

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);

      const response = await fetch(
        `${API_BASE}/employees`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Invalid employee API response. HTTP ${response.status}`
        );
      }

      console.log(
        "EMPLOYEES RESPONSE:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to load employees."
        );
      }

      setEmployees(
        Array.isArray(data.employees)
          ? data.employees
          : Array.isArray(data.data)
          ? data.data
          : []
      );
    } catch (error) {
      console.error(
        "Employee fetch error:",
        error
      );

      setEmployees([]);

      alert(
        error.message ||
          "Unable to load employees."
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch Roles
  |--------------------------------------------------------------------------
  */

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);

     const response = await apiFetch("/roles");


      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Invalid roles API response. HTTP ${response.status}`
        );
      }

      console.log(
        "ROLES RESPONSE:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to load roles."
        );
      }

      setRoles(
        Array.isArray(data.roles)
          ? data.roles
          : Array.isArray(data.data)
          ? data.data
          : []
      );
    } catch (error) {
      console.error(
        "Role fetch error:",
        error
      );

      setRoles([]);

      alert(
        error.message ||
          "Unable to load roles."
      );
    } finally {
      setLoadingRoles(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Normal Input Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Role Change
  |--------------------------------------------------------------------------
  */

  const handleRoleChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    );

    setFormData((prev) => ({
      ...prev,
      roles: values,
    }));

    setErrors((prev) => ({
      ...prev,
      roles: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Role
  |--------------------------------------------------------------------------
  */

  const removeRole = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter(
        (id) =>
          Number(id) !== Number(roleId)
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      roles: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Employee Change
  |--------------------------------------------------------------------------
  */

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;

    if (!employeeId) {
      setFormData((prev) => ({
        ...prev,

        employeeId: "",

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        username: "",
      }));

      return;
    }

    const employee = employees.find(
      (item) =>
        String(item.employee_id) ===
        String(employeeId)
    );

    if (!employee) {
      console.warn(
        "Employee not found:",
        employeeId
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Department
    |--------------------------------------------------------------------------
    */

    let departmentName = "";

    if (
      Array.isArray(employee.departments)
    ) {
      departmentName =
        employee.departments
          .map(
            (department) =>
              department?.name
          )
          .filter(Boolean)
          .join(", ");
    }

    if (
      !departmentName &&
      employee.department
    ) {
      departmentName =
        employee.department;
    }

    /*
    |--------------------------------------------------------------------------
    | Username
    |--------------------------------------------------------------------------
    */

    const firstName =
      employee.first_name || "";

    const lastName =
      employee.last_name || "";

    let username =
      `${firstName}.${lastName}`
        .toLowerCase()
        .replace(/\s+/g, "");

    /*
    |--------------------------------------------------------------------------
    | If username already generated empty
    |--------------------------------------------------------------------------
    */

    if (!username || username === ".") {
      username = "";
    }

    /*
    |--------------------------------------------------------------------------
    | Set Employee Data
    |--------------------------------------------------------------------------
    */

    setFormData((prev) => ({
      ...prev,

      employeeId:
        employee.employee_id || "",

      firstName,

      lastName,

      email:
        employee.email || "",

      phone:
        employee.phone || "",

      department:
        departmentName,

      designation:
        employee.designation || "",

      username,
    }));

    setErrors((prev) => ({
      ...prev,

      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
    }));
  };

  

  const selectedRoleObjects =
    roles.filter((role) =>
      formData.roles.includes(
        Number(role.id)
      )
    );

 
  const isEmployee =
    selectedRoleObjects.some(
      (role) =>
        String(role.name)
          .trim()
          .toLowerCase() ===
        "employee"
    );

 

  const validateForm = () => {
    const newErrors = {};

   
    if (!formData.roles.length) {
      newErrors.roles =
        "Please select at least one role.";
    }


    if (
      isEmployee &&
      !formData.employeeId
    ) {
      newErrors.employeeId =
        "Please select an employee.";
    }

   

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

   

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email.";
    }

    
    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone is required.";
    }

   

    if (!formData.username.trim()) {
      newErrors.username =
        "Username is required.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    } else if (
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

   
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      setErrors({});

     const payload = {
    first_name: formData.firstName.trim(),
    last_name: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),

    role_ids: formData.roles,

    employee_id: formData.employeeId || null,

    department: formData.department.trim() || null,
    designation: formData.designation.trim() || null,

    username: formData.username.trim(),
    password: formData.password,
    password_confirmation: formData.confirmPassword,

    status: formData.status,

    send_welcome_email: Boolean(
        formData.sendWelcomeEmail
    ),
};


      console.log(
        "CREATE USER PAYLOAD:",
        payload
      );

      /* API Request*/
const response = await apiFetch("/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

    

      const text =
        await response.text();

      console.log(
        "CREATE USER HTTP STATUS:",
        response.status
      );

      console.log(
        "CREATE USER RAW RESPONSE:",
        text
      );

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch (jsonError) {
        console.error(
          "Invalid JSON from Laravel:",
          text
        );

        throw new Error(
          `Server returned invalid response. HTTP ${response.status}`
        );
      }

      console.log(
        "CREATE USER RESPONSE:",
        data
      );

      

      if (!response.ok) {
      
        if (data.errors) {
          const backendErrors = {};

          Object.keys(
            data.errors
          ).forEach((key) => {
            const value =
              data.errors[key];

            backendErrors[key] =
              Array.isArray(value)
                ? value[0]
                : value;
          });

          setErrors(
            backendErrors
          );
        }

       

        console.error(
          "BACKEND ERROR:",
          data.error
        );

        throw new Error(
          data.error ||
          data.message ||
          `Unable to create user. HTTP ${response.status}`
        );
      }

     
      alert(
        data.message ||
          "User created successfully."
      );

      navigate("/userList");

    } catch (error) {
      console.error(
        "Create User Error:",
        error
      );

      alert(
        error.message ||
          "Unable to create user."
      );

    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="add-user-page">

      {/* HEADER */}

      <div className="add-user-header">
        <div>
          <h1>Add User</h1>

          <p>
            Create employee and system users.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="user-form"
      >

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-section-icon blue">
              👤
            </div>

            <div>
              <h2>User Information</h2>

              <p>
                Select one or more roles for this user.
              </p>
            </div>

          </div>

          {/* ROLES */}

          <div className="form-group">

            <label>
              Roles
              <span>*</span>
            </label>

            <select
              multiple
              value={formData.roles.map(
                String
              )}
              onChange={
                handleRoleChange
              }
              disabled={loadingRoles}
              className={
                errors.roles
                  ? "input-error"
                  : ""
              }
            >

              {loadingRoles && (
                <option disabled>
                  Loading roles...
                </option>
              )}

              {!loadingRoles &&
                roles.length === 0 && (
                  <option disabled>
                    No roles available
                  </option>
                )}

              {roles.map((role) => (
                <option
                  key={`role-option-${role.id}`}
                  value={role.id}
                >
                  {role.name}
                </option>
              ))}

            </select>

            <small>
              Hold Ctrl/Cmd to select multiple roles.
            </small>

            {/* SELECTED ROLE BADGES */}

            {selectedRoleObjects.length >
              0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >

                {selectedRoleObjects.map(
                  (role) => (
                    <span
                      key={`selected-role-${role.id}`}
                      style={{
                        background:
                          "#eef2ff",
                        color:
                          "#3730a3",
                        padding:
                          "7px 12px",
                        borderRadius:
                          "20px",
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        fontSize:
                          "14px",
                      }}
                    >

                      {role.name}

                      <button
                        type="button"
                        onClick={() =>
                          removeRole(
                            role.id
                          )
                        }
                        style={{
                          border:
                            "none",
                          background:
                            "transparent",
                          cursor:
                            "pointer",
                          color:
                            "#dc2626",
                          fontWeight:
                            "bold",
                        }}
                      >
                        ×
                      </button>

                    </span>
                  )
                )}

              </div>
            )}

            {errors.roles && (
              <small className="error-text">
                {errors.roles}
              </small>
            )}

          </div>

          {/* EMPLOYEE SELECT */}

          {isEmployee && (
            <div className="form-group">

              <label>
                Select Employee
                <span>*</span>
              </label>

              <select
                value={
                  formData.employeeId
                }
                onChange={
                  handleEmployeeChange
                }
                disabled={
                  loadingEmployees
                }
                className={
                  errors.employeeId
                    ? "input-error"
                    : ""
                }
              >

                <option value="">
                  {loadingEmployees
                    ? "Loading employees..."
                    : "Select employee"}
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={`employee-option-${employee.id}`}
                      value={
                        employee.employee_id
                      }
                    >
                      {
                        employee.employee_id
                      }
                      {" - "}
                      {
                        employee.first_name
                      }{" "}
                      {
                        employee.last_name
                      }
                    </option>
                  )
                )}

              </select>

              {errors.employeeId && (
                <small className="error-text">
                  {errors.employeeId}
                </small>
              )}

            </div>
          )}

          {/* FORM GRID */}

          <div className="form-grid">

            {/* FIRST NAME */}

            <div className="form-group">

              <label>
                First Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="firstName"
                value={
                  formData.firstName
                }
                onChange={
                  handleChange
                }
                readOnly={isEmployee}
                className={
                  isEmployee
                    ? "readonly-input"
                    : errors.firstName
                    ? "input-error"
                    : ""
                }
                placeholder="Enter first name"
              />

              {errors.firstName && (
                <small className="error-text">
                  {errors.firstName}
                </small>
              )}

            </div>

            {/* LAST NAME */}

            <div className="form-group">

              <label>
                Last Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="lastName"
                value={
                  formData.lastName
                }
                onChange={
                  handleChange
                }
                readOnly={isEmployee}
                className={
                  isEmployee
                    ? "readonly-input"
                    : errors.lastName
                    ? "input-error"
                    : ""
                }
                placeholder="Enter last name"
              />

              {errors.lastName && (
                <small className="error-text">
                  {errors.lastName}
                </small>
              )}

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
                <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                readOnly={isEmployee}
                className={
                  isEmployee
                    ? "readonly-input"
                    : errors.email
                    ? "input-error"
                    : ""
                }
                placeholder="Enter email"
              />

              {errors.email && (
                <small className="error-text">
                  {errors.email}
                </small>
              )}

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone
                <span>*</span>
              </label>

              <input
                type="text"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                readOnly={isEmployee}
                className={
                  isEmployee
                    ? "readonly-input"
                    : errors.phone
                    ? "input-error"
                    : ""
                }
                placeholder="Enter phone"
              />

              {errors.phone && (
                <small className="error-text">
                  {errors.phone}
                </small>
              )}

            </div>

            {/* EMPLOYEE ID */}

            {isEmployee && (
              <div className="form-group">

                <label>
                  Employee ID
                </label>

                <input
                  type="text"
                  value={
                    formData.employeeId
                  }
                  readOnly
                  className="readonly-input"
                />

              </div>
            )}

            {/* DEPARTMENT */}

            <div className="form-group">

              <label>
                Department
              </label>

              <input
                type="text"
                name="department"
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
                readOnly={isEmployee}
                className={
                  isEmployee
                    ? "readonly-input"
                    : ""
                }
                placeholder="Enter department"
              />

            </div>

            {/* DESIGNATION */}

            <div className="form-group">

              <label>
                Designation
              </label>

              <input
                type="text"
                name="designation"
                value={
                  formData.designation
                }
                onChange={
                  handleChange
                }
                readOnly={isEmployee}
                className={
                  isEmployee
                    ? "readonly-input"
                    : ""
                }
                placeholder="Enter designation"
              />

            </div>

          </div>

        </div>

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-section-icon purple">
              🔐
            </div>

            <div>
              <h2>
                Account Access
              </h2>

              <p>
                Configure login credentials.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* USERNAME */}

            <div className="form-group">

              <label>
                Username
                <span>*</span>
              </label>

              <input
                type="text"
                name="username"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                placeholder="Enter username"
                className={
                  errors.username
                    ? "input-error"
                    : ""
                }
              />

              {errors.username && (
                <small className="error-text">
                  {errors.username}
                </small>
              )}

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
                <span>*</span>
              </label>

              <input
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter password"
                className={
                  errors.password
                    ? "input-error"
                    : ""
                }
              />

              {errors.password && (
                <small className="error-text">
                  {errors.password}
                </small>
              )}

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                Confirm Password
                <span>*</span>
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Confirm password"
                className={
                  errors.confirmPassword
                    ? "input-error"
                    : ""
                }
              />

              {errors.confirmPassword && (
                <small className="error-text">
                  {
                    errors.confirmPassword
                  }
                </small>
              )}

            </div>

          </div>

          {/* STATUS */}

          <div className="status-section">

            <div className="form-group">

              <label>
                Account Status
              </label>

              <div className="radio-group">

                <label className="radio-label">

                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={
                      formData.status ===
                      "Active"
                    }
                    onChange={
                      handleChange
                    }
                  />

                  Active

                </label>

                <label className="radio-label">

                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={
                      formData.status ===
                      "Inactive"
                    }
                    onChange={
                      handleChange
                    }
                  />

                  Inactive

                </label>

              </div>

            </div>

            {/* WELCOME EMAIL */}

            <label className="checkbox-label">

              <input
                type="checkbox"
                name="sendWelcomeEmail"
                checked={
                  formData.sendWelcomeEmail
                }
                onChange={
                  handleChange
                }
              />

              <span>
                Send welcome email
              </span>

            </label>

          </div>

        </div>

     
        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/userList")
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
              ? "Creating..."
              : "✓ Create User"}
          </button>

        </div>

      </form>
    </div>
  );
}
