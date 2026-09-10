import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

export default function ViewUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      alert("User ID is missing.");
      navigate("/userList");
      return;
    }

    if (!source) {
      alert("User source is missing.");
      navigate("/userList");
      return;
    }

    fetchUser();
  }, [id, source]);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const url =
        `${API_BASE}/users/${id}` +
        `?source=${encodeURIComponent(source)}`;

      console.log("FETCH USER:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
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

      const userData =
        data.user ||
        data.data ||
        data;

      if (!userData) {
        throw new Error(
          "User data not found."
        );
      }

      setUser(userData);
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

  if (loading) {
    return (
      <div className="add-user-page">
        <div className="form-card">
          <h2>Loading User...</h2>
          <p>
            Please wait while user information
            is being loaded.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="add-user-page">

      <div className="add-user-header">
        <div>
          <h1>View User</h1>
          <p>
            View user and account information.
          </p>
        </div>
      </div>

      <div className="form-card">

        <div className="form-card-header">
          <div className="form-section-icon blue">
            👤
          </div>

          <div>
            <h2>User Information</h2>
            <p>
              User personal and role information.
            </p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={user.first_name || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={user.last_name || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user.email || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={user.phone || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              value={user.employee_id || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={user.department || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              value={user.designation || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={user.username || ""}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input
              type="text"
              value={user.status || ""}
              readOnly
              className="readonly-input"
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
            <h2>Account Access</h2>
            <p>
              User role information.
            </p>
          </div>

        </div>

        <div className="form-group">

          <label>Roles</label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {Array.isArray(user.roles) &&
              user.roles.map((role) => (
                <span
                  key={role.id}
                  style={{
                    background: "#eef2ff",
                    color: "#3730a3",
                    padding: "7px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                  }}
                >
                  {role.name}
                </span>
              ))}

            {(!Array.isArray(user.roles) ||
              user.roles.length === 0) && (
              <span>No roles assigned</span>
            )}
          </div>

        </div>

        <div className="form-group">

          <label>Send Welcome Email</label>

          <input
            type="text"
            value={
              user.send_welcome_email
                ? "Yes"
                : "No"
            }
            readOnly
            className="readonly-input"
          />

        </div>

      </div>

      <div className="form-actions">

        <button
          type="button"
          className="cancel-btn"
          onClick={() =>
            navigate("/userList")
          }
        >
          Back
        </button>

        <button
          type="button"
          className="create-user-btn"
          onClick={() =>
            navigate(
              `/editUser/${id}?source=${encodeURIComponent(source)}`
            )
          }
        >
          ✎ Edit User
        </button>

      </div>

    </div>
  );
}
