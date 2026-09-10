import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./User.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function EditRole() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prefix: "",
    status: "Active",
    permissions: [],
  });

  const [errors, setErrors] = useState({});

  /*
  | Load Role + Permissions
  */ 

  useEffect(() => {
    if (!id) {
      alert("Role ID is missing.");
      navigate("/roles");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        /*
        | Load permissions
        */

        const permissionsResponse = await fetch(
          `${API_BASE}/permissions`
        );

        const permissionsData =
          await permissionsResponse.json();

        if (!permissionsResponse.ok) {
          throw new Error(
            permissionsData.message ||
              "Unable to load permissions"
          );
        }

        setPermissions(
          permissionsData.permissions || []
        );

      

        const roleResponse = await fetch(
          `${API_BASE}/roles/${id}`
        );

        const roleData =
          await roleResponse.json();

        if (!roleResponse.ok) {
          throw new Error(
            roleData.message ||
              "Unable to load role"
          );
        }

        /*
        | Handle different possible API response formats
        */

        const role =
          roleData.role ||
          roleData.data ||
          roleData;

        /*
       
        | Get permission IDs
        
        */

        let rolePermissionIds = [];

        if (Array.isArray(role.permissions)) {
          rolePermissionIds =
            role.permissions.map(
              (permission) => {
                /*
                If API returns:
                permissions: [{ id: 1, name: "View Users" }]

                */

                if (
                  typeof permission === "object"
                ) {
                  return Number(
                    permission.id
                  );
                }

               

                return Number(permission);
              }
            );
        }

       
        setFormData({
          name: role.name || "",

          description:
            role.description || "",

          prefix:
            role.prefix || "",

          status:
            role.status || "Active",

          permissions:
            rolePermissionIds,
        });
      } catch (error) {
        console.error(
          "Role loading error:",
          error
        );

        alert(
          error.message ||
            "Unable to load role"
        );

        navigate("/roles");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);


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

 
  const handlePermissionChange = (permissionId) => {
    const id = Number(permissionId);

    setFormData((prev) => {
      const exists =
        prev.permissions.includes(id);

      return {
        ...prev,

        permissions: exists
          ? prev.permissions.filter(
              (permission) =>
                permission !== id
            )
          : [
              ...prev.permissions,
              id,
            ],
      };
    });
  };


  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Role name is required";
    }

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

      const response = await fetch(
        `${API_BASE}/roles/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
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

            permissions:
              formData.permissions,
          }),
        }
      );

      const data =
        await response.json();

      

      if (!response.ok) {
        if (data.errors) {
          const backendErrors = {};

          Object.keys(data.errors).forEach(
            (key) => {
              backendErrors[key] =
                Array.isArray(
                  data.errors[key]
                )
                  ? data.errors[key][0]
                  : data.errors[key];
            }
          );

          setErrors(
            backendErrors
          );
        }

        throw new Error(
          data.message ||
            "Unable to update role"
        );
      }


      alert(
        "Role updated successfully."
      );

      navigate("/roles");
    } catch (error) {
      console.error(
        "Role update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update role"
      );
    } finally {
      setSaving(false);
    }
  };

 
  if (loading) {
    return (
      <div className="add-user-page">
        <div className="add-user-header">
          <h1>
            Edit Role
          </h1>

          <p>
            Loading role information...
          </p>
        </div>

        <div className="form-card">
          <p>
            Loading...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="add-user-page">

      {/* HEADER */}

      <div className="add-user-header">

        <h1>
          Edit Role
        </h1>

        <p>
          Update role information and
          permissions.
        </p>

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
                Update basic role information.
              </p>

            </div>

          </div>

          <div className="form-grid">

            {/* ROLE NAME */}

            <div className="form-group">

              <label>
                Role Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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

            {/* PREFIX */}

            <div className="form-group">

              <label>
                User ID Prefix
                <span>*</span>
              </label>

              <input
                type="text"
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
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

            {/* DESCRIPTION */}

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
              🔐
            </div>

            <div>

              <h2>
                Permissions
              </h2>

              <p>
                Update permissions assigned
                to this role.
              </p>

            </div>

          </div>

          {permissions.length === 0 ? (

            <p>
              No permissions available.
            </p>

          ) : (

            <div
              className="permission-list"
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap: "12px",
              }}
            >

              {permissions.map(
                (permission) => {

                  const permissionId =
                    Number(
                      permission.id
                    );

                  return (
                    <label
                      key={
                        permission.id
                      }
                      className="checkbox-label"
                    >

                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(
                          permissionId
                        )}
                        onChange={() =>
                          handlePermissionChange(
                            permissionId
                          )
                        }
                      />

                      <span>

                        <strong>
                          {
                            permission.name
                          }
                        </strong>

                        {permission.description && (
                          <small>
                            {" "}
                            -{" "}
                            {
                              permission.description
                            }
                          </small>
                        )}

                      </span>

                    </label>
                  );
                }
              )}

            </div>

          )}

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
              ? "Updating..."
              : "✓ Update Role"}

          </button>

        </div>

      </form>

    </div>
  );
}
