import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./User.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source");

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingEmployees, setLoadingEmployees] =
    useState(false);
  const [loadingRoles, setLoadingRoles] =
    useState(false);
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


  useEffect(() => {
    if (!id) {
      alert("User ID is missing.");
      navigate("/userList");
      return;
    }

    if (!source) {
      alert(
        "User source is missing. Please open the edit page with a valid source."
      );
      navigate("/userList");
      return;
    }

    fetchEmployees();
    fetchRoles();
    fetchUser();
  }, [id, source]);

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

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);

      const response = await fetch(
        `${API_BASE}/roles`,
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
          `Invalid roles API response. HTTP ${response.status}`
        );
      }

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

  const fetchUser = async () => {
    try {
      setLoading(true);

      if (!id) {
        throw new Error(
          "User ID is required."
        );
      }

      if (!source) {
        throw new Error(
          "User source is required."
        );
      }

      const url =
        `${API_BASE}/users/${id}` +
        `?source=${encodeURIComponent(source)}`;

      console.log(
        "FETCH USER:",
        url
      );

      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const text =
        await response.text();

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          `Invalid user API response. HTTP ${response.status}`
        );
      }

      console.log(
        "USER RESPONSE:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to load user."
        );
      }

      const user =
        data.user ||
        data.data ||
        data;

      if (
        !user ||
        typeof user !== "object"
      ) {
        throw new Error(
          "User data not found."
        );
      }

      let roleIds = [];

      if (Array.isArray(user.roles)) {
        roleIds = user.roles
          .map((role) =>
            Number(
              role?.id ??
                role?.role_id
            )
          )
          .filter(Boolean);
      }

      if (
        Array.isArray(
          user.role_ids
        )
      ) {
        roleIds = user.role_ids
          .map(Number)
          .filter(Boolean);
      }

      const employeeId =
        user.employee_id || "";

      let departmentName =
        user.department || "";

      if (
        !departmentName &&
        user.employee &&
        Array.isArray(
          user.employee.departments
        )
      ) {
        departmentName =
          user.employee.departments
            .map(
              (department) =>
                department?.name
            )
            .filter(Boolean)
            .join(", ");
      }

      setFormData({
        roles: roleIds,

        employeeId,

        firstName:
          user.first_name ||
          user.employee?.first_name ||
          "",

        lastName:
          user.last_name ||
          user.employee?.last_name ||
          "",

        email:
          user.email ||
          user.employee?.email ||
          "",

        phone:
          user.phone ||
          user.employee?.phone ||
          "",

        department:
          departmentName,

        designation:
          user.designation ||
          user.employee?.designation ||
          "",

        username:
          user.username || "",

        password: "",

        confirmPassword: "",

        status:
          user.status || "Active",

        sendWelcomeEmail:
          Boolean(
            user.send_welcome_email ??
              user.sendWelcomeEmail ??
              false
          ),
      });
    } catch (error) {
      console.error(
        "Fetch user error:",
        error
      );

      alert(
        error.message ||
          "Unable to load user."
      );

      navigate("/userList");
    } finally {
      setLoading(false);
    }
  };

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


  const handleRoleChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) =>
        Number(option.value)
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


  const removeRole = (roleId) => {
    setFormData((prev) => ({
      ...prev,

      roles: prev.roles.filter(
        (id) =>
          Number(id) !==
          Number(roleId)
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      roles: "",
    }));
  };


  const handleEmployeeChange = (e) => {
    const employeeId =
      e.target.value;

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

    const employee =
      employees.find(
        (item) =>
          String(
            item.employee_id
          ) ===
          String(employeeId)
      );

    if (!employee) {
      console.warn(
        "Employee not found:",
        employeeId
      );

      return;
    }

    let departmentName = "";

    if (
      Array.isArray(
        employee.departments
      )
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

    const firstName =
      employee.first_name || "";

    const lastName =
      employee.last_name || "";

    let username =
      `${firstName}.${lastName}`
        .toLowerCase()
        .replace(/\s+/g, "");

    if (
      !username ||
      username === "."
    ) {
      username = "";
    }

    setFormData((prev) => ({
      ...prev,

      employeeId:
        employee.employee_id ||
        "",

      firstName,

      lastName,

      email:
        employee.email || "",

      phone:
        employee.phone || "",

      department:
        departmentName,

      designation:
        employee.designation ||
        "",

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

    if (
      !formData.firstName.trim()
    ) {
      newErrors.firstName =
        "First name is required.";
    }

    if (
      !formData.lastName.trim()
    ) {
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

    if (
      !formData.username.trim()
    ) {
      newErrors.username =
        "Username is required.";
    }

    if (
      formData.password &&
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (
      formData.password &&
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Please confirm new password.";
    }

    if (
      formData.password &&
      formData.password !==
        formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

  
    if (!source) {
      alert(
        "User source is required."
      );
      return;
    }

    if (!id) {
      alert(
        "User ID is required."
      );
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      const payload = {
        source: source,

        first_name:
          formData.firstName.trim(),

        last_name:
          formData.lastName.trim(),

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim(),

        role_ids:
          formData.roles,

        employee_id:
          formData.employeeId || null,

        department:
          formData.department.trim() ||
          null,

        designation:
          formData.designation.trim() ||
          null,

        username:
          formData.username.trim(),

        status:
          formData.status,

        send_welcome_email:
          Boolean(
            formData.sendWelcomeEmail
          ),
      };


      if (formData.password) {
        payload.password =
          formData.password;

        payload.password_confirmation =
          formData.confirmPassword;
      }

      console.log(
        "UPDATE USER ID:",
        id
      );

      console.log(
        "UPDATE USER SOURCE:",
        source
      );

      console.log(
        "UPDATE USER PAYLOAD:",
        payload
      );

      const response = await fetch(
        `${API_BASE}/users/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(
              payload
            ),
        }
      );

      const text =
        await response.text();

      console.log(
        "UPDATE USER STATUS:",
        response.status
      );

      console.log(
        "UPDATE USER RESPONSE:",
        text
      );

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          `Server returned invalid response. HTTP ${response.status}`
        );
      }

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
          "UPDATE BACKEND ERROR:",
          data.error ||
            data.message ||
            data.errors
        );

        throw new Error(
          data.error ||
            data.message ||
            `Unable to update user. HTTP ${response.status}`
        );
      }

      alert(
        data.message ||
          "User updated successfully."
      );

      navigate("/userList");
    } catch (error) {
      console.error(
        "Update User Error:",
        error
      );

      alert(
        error.message ||
          "Unable to update user."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="add-user-page">
        <div className="form-card">
          <h2>
            Loading User...
          </h2>

          <p>
            Please wait while user
            information is being loaded.
          </p>
        </div>
      </div>
    );
  }

 

  return (
    <div className="add-user-page">

      {/* HEADER */}

      <div className="add-user-header">
        <div>
          <h1>
            Edit User
          </h1>

          <p>
            Update employee and
            system user information.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="user-form"
      >

        {/* USER INFORMATION */}

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-section-icon blue">
              👤
            </div>

            <div>
              <h2>
                User Information
              </h2>

              <p>
                Update roles and
                personal information.
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
              disabled={
                loadingRoles
              }
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
              Hold Ctrl/Cmd to select
              multiple roles.
            </small>

            {selectedRoleObjects.length >
              0 && (
              <div
                style={{
                  display:
                    "flex",
                  flexWrap:
                    "wrap",
                  gap: "8px",
                  marginTop:
                    "10px",
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

          {/* EMPLOYEE */}

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
                  {
                    errors.employeeId
                  }
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
                readOnly={
                  isEmployee
                }
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
                  {
                    errors.firstName
                  }
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
                readOnly={
                  isEmployee
                }
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
                  {
                    errors.lastName
                  }
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
                readOnly={
                  isEmployee
                }
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
                readOnly={
                  isEmployee
                }
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
                readOnly={
                  isEmployee
                }
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
                readOnly={
                  isEmployee
                }
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

        {/* ACCOUNT ACCESS */}

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
                Update login credentials.
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
                  {
                    errors.username
                  }
                </small>
              )}

            </div>

            {/* NEW PASSWORD */}

            <div className="form-group">

              <label>
                New Password
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
                placeholder="Leave blank to keep current password"
                className={
                  errors.password
                    ? "input-error"
                    : ""
                }
              />

              <small>
                Leave blank if you do not
                want to change the password.
              </small>

              {errors.password && (
                <small className="error-text">
                  {
                    errors.password
                  }
                </small>
              )}

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                Confirm New Password
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
                placeholder="Confirm new password"
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

        {/* ACTIONS */}

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
              ? "Updating..."
              : "✓ Update User"}
          </button>

        </div>

      </form>
    </div>
  );
}
