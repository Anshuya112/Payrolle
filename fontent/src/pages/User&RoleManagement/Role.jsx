import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Roles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const getAuthToken = () => {
    try {
      const authData = JSON.parse(
        localStorage.getItem("payroll_auth") || "{}"
      );

      return authData.token || null;
    } catch (error) {
      console.error(
        "Unable to read authentication data:",
        error
      );

      return null;
    }
  };

  /*
   * Fetch Roles
   */
  const fetchRoles = async () => {
    try {
      setLoading(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE}/roles`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /*
       * Read response safely
       */
      const text = await response.text();

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch (error) {
        console.error(
          "Invalid JSON response:",
          text
        );

        throw new Error(
          `Invalid server response. HTTP Status: ${response.status}`
        );
      }

      /*
       * Unauthorized
       */
      if (response.status === 401) {
        localStorage.removeItem(
          "payroll_auth"
        );

        localStorage.removeItem(
          "payroll_user"
        );

        throw new Error(
          "Session expired. Please login again."
        );
      }

      /*
       * Other API errors
       */
      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Unable to load roles. HTTP Status: ${response.status}`
        );
      }

      /*
       * Laravel response expected:
       *
       * {
       *   "roles": [...]
       * }
       */
      setRoles(
        Array.isArray(data.roles)
          ? data.roles
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch roles error:",
        error
      );

      /*
       * Redirect to login if authentication fails
       */
      if (
        error.message.includes(
          "login again"
        ) ||
        error.message.includes(
          "Authentication token"
        )
      ) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        error.message ||
          "Unable to load roles"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Load roles when page opens
   */
  useEffect(() => {
    fetchRoles();
  }, []);

  /*
   * Delete Role
   */
  const deleteRole = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this role?"
      )
    ) {
      return;
    }

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE}/roles/${id}`,
        {
          method: "DELETE",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch (error) {
        console.error(
          "Invalid delete response:",
          text
        );

        throw new Error(
          `Invalid server response. HTTP Status: ${response.status}`
        );
      }

      /*
       * Unauthorized
       */
      if (response.status === 401) {
        localStorage.removeItem(
          "payroll_auth"
        );

        localStorage.removeItem(
          "payroll_user"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      /*
       * Delete error
       */
      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to delete role"
        );
      }

      /*
       * Remove deleted role from UI
       */
      setRoles((prev) =>
        prev.filter(
          (role) =>
            role.id !== id
        )
      );

      alert(
        "Role deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete role error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete role"
      );
    }
  };

  /*
   * Total Permissions
   */
  const totalPermissions =
    roles.reduce(
      (total, role) =>
        total +
        (
          role.permissions_count ||
          role.permissions?.length ||
          0
        ),
      0
    );

  /*
   * Active Roles
   */
  const activeRoles =
    roles.filter(
      (role) =>
        role.status === "Active"
    ).length;

  return (
    <div className="roles-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h1>
            Roles
          </h1>

          <p>
            Create and manage system roles.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/roles/add")
          }
        >
          + Create Role
        </button>

      </div>


      {/* STATS */}

      <div className="role-stat-grid">

        <div className="role-stat-card">

          <span>
            Total Roles
          </span>

          <strong>
            {roles.length}
          </strong>

        </div>


        <div className="role-stat-card">

          <span>
            Active Roles
          </span>

          <strong>
            {activeRoles}
          </strong>

        </div>


        <div className="role-stat-card">

          <span>
            Total Permissions
          </span>

          <strong>
            {totalPermissions}
          </strong>

        </div>

      </div>


      {/* ROLE CARDS */}

      {loading ? (

        <p>
          Loading roles...
        </p>

      ) : roles.length === 0 ? (

        <p>
          No roles found.
        </p>

      ) : (

        <div className="roles-grid">

          {roles.map((role) => (

            <div
              className="role-card"
              key={role.id}
            >

              <div className="role-card-top">

                <div className="role-icon">
                  🛡️
                </div>

              </div>


              <h3>
                {role.name}
              </h3>


              <p>
                {role.description ||
                  "No description"}
              </p>


              <div className="role-info">

                <div>

                  <span>
                    Permissions
                  </span>

                  <strong>
                    {
                      role.permissions_count ||
                      role.permissions?.length ||
                      0
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Prefix
                  </span>

                  <strong>
                    {role.prefix || "-"}
                  </strong>

                </div>

              </div>


              <div className="role-card-footer">

                <span className="active-role">

                  ●{" "}
                  {role.status ||
                    "Unknown"}

                </span>


                <div>

                  <button
                    className="small-edit"
                    onClick={() =>
                      navigate(
                        `/roles/edit/${role.id}`
                      )
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="small-delete"
                    onClick={() =>
                      deleteRole(
                        role.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* TABLE */}

      <div className="role-table-card">

        <div className="table-header">

          <div>

            <h3>
              Role Permissions
            </h3>

            <span>
              Overview of role access
            </span>

          </div>

        </div>


        <div className="table-responsive">

          <table className="roles-table">

            <thead>

              <tr>

                <th>
                  Role
                </th>

                <th>
                  Prefix
                </th>

                <th>
                  Permissions
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {roles.map((role) => (

                <tr
                  key={role.id}
                >

                  <td>

                    <strong>
                      {role.name}
                    </strong>

                  </td>


                  <td>

                    <span className="permission-badge">
                      {role.prefix ||
                        "-"}
                    </span>

                  </td>


                  <td>

                    <span
                      className="permission-badge"
                      onClick={() =>
                        navigate(
                          `/permissions/edit/${role.id}`
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >

                      {
                        role.permissions_count ||
                        role.permissions?.length ||
                        0
                      }{" "}

                      Permissions

                    </span>

                  </td>


                  <td>

                    <span className="status-badge active">

                      ●{" "}
                      {role.status ||
                        "Unknown"}

                    </span>

                  </td>


                  <td>

                    <button
                      className="small-edit"
                      onClick={() =>
                        navigate(
                          `/roles/edit/${role.id}`
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="small-delete"
                      onClick={() =>
                        deleteRole(
                          role.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
