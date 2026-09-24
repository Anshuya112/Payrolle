import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./User.css";
import { getToken } from "../../utils/auth";

const API_BASE = "http://127.0.0.1:8000/api";

export default function AddRole() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prefix: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});


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


  const validate = () => {
    const newErrors = {};

    // Role Name
    if (!formData.name.trim()) {
      newErrors.name =
        "Role name is required";
    }

    // Prefix
    if (!formData.prefix.trim()) {
      newErrors.prefix =
        "Role prefix is required";
    }

    if (
      formData.prefix.trim().length > 10
    ) {
      newErrors.prefix =
        "Prefix must be maximum 10 characters";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      console.log(
        "Authentication token:",
        token ? "Found" : "Not Found"
      );

      if (!token) {
        alert(
          "You are not logged in. Please login again."
        );

        navigate("/login");

        return;
      }


      const response = await fetch(
        `${API_BASE}/roles`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name:
              formData.name.trim(),

            description:
              formData.description.trim() ||
              null,

            prefix:
              formData.prefix
                .trim()
                .toUpperCase(),

            status:
              formData.status,
          }),
        }
      );

      let data = {};

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        contentType &&
        contentType.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      } else {
        const text =
          await response.text();

        data = {
          message: text,
        };
      }


      if (response.status === 401) {
        alert(
          "Your login session has expired. Please login again."
        );

        navigate("/login");

        return;
      }


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
            "Unable to create role"
        );
      }


      alert(
        "Role created successfully."
      );

      navigate("/roles");

    } catch (error) {
      console.error(
        "Role creation error:",
        error
      );

      alert(
        error.message ||
          "Unable to create role"
      );

    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="add-user-page">


      <div className="add-user-header">

        <div>

          <div className="breadcrumb-small">

            <span
              onClick={() =>
                navigate("/roles")
              }
              style={{
                cursor: "pointer",
              }}
            >
              Roles
            </span>

            <b>/</b>

            <strong>
              Add Role
            </strong>

          </div>

          <h1>
            Create Role
          </h1>

          <p>
            Create a new role for your
            organization.
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
              🛡️
            </div>

            <div>

              <h2>
                Role Information
              </h2>

              <p>
                Configure basic information
                about this role.
              </p>

            </div>

          </div>

          <div className="form-grid">


            <div className="form-group">

              <label>
                Role Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. HR Manager"
                className={
                  errors.name
                    ? "input-error"
                    : ""
                }
              />

              {errors.name && (
                <small className="error-text">
                  {errors.name}
                </small>
              )}

            </div>


            <div className="form-group">

              <label>
                User ID Prefix
                <span>*</span>
              </label>

              <input
                type="text"
                name="prefix"
                value={
                  formData.prefix
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. HR"
                maxLength={10}
                className={
                  errors.prefix
                    ? "input-error"
                    : ""
                }
              />

              {errors.prefix && (
                <small className="error-text">
                  {errors.prefix}
                </small>
              )}

              <small>
                Example: HR1001
              </small>

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
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Describe this role"
                rows="4"
              />

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


        <div className="form-card access-info-card">

          <div className="access-info-icon">
            💡
          </div>

          <div>

            <h3>
              Role & Permission
            </h3>

            <p>
              Roles are created separately.
              Permissions can be assigned
              later only when the permission
              name matches an existing role.
            </p>

          </div>

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/role")
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
              : "✓ Create Role"}
          </button>

        </div>

      </form>

    </div>
  );
}
