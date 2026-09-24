import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";

import {
  getToken,
} from "../../utils/auth";

import {
  apiFetch,
} from "../../utils/api";

export default function UserList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/users";

  
  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      console.log(
        " [USERS] Token exists:",
        !!token
      );

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

     

      const response = await apiFetch(
        "/users",
        {
          method: "GET",
        }
      );

      console.log(
        "[USERS] HTTP Status:",
        response.status
      );

      const text = await response.text();

      console.log(
        "[USERS] Raw API Response:",
        text
      );

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch (jsonError) {
        console.error(
          "[USERS] Invalid JSON:",
          text
        );

        throw new Error(
          `Server returned invalid JSON. HTTP ${response.status}`
        );
      }

      console.log(
        " [USERS] API Data:",
        data
      );

      

      if (response.status === 401) {
        throw new Error(
          "Unauthenticated. Please login again."
        );
      }

     

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          `Unable to fetch users. HTTP ${response.status}`
        );
      }

   

      const apiUsers =
        Array.isArray(data.users)
          ? data.users
          : [];

      

      const uniqueUsers =
        apiUsers.filter(
          (user, index, array) =>
            index ===
            array.findIndex(
              (item) =>
                item.id === user.id &&
                item.source === user.source
            )
        );

      setUsers(uniqueUsers);

    } catch (error) {
      console.error(
        " [USERS] Get Users Error:",
        error
      );

      setError(
        error.message ||
        "Unable to load users."
      );

    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    getUsers();
  }, []);



  const deleteUser = async (
    id,
    source
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      console.log(
        "🔑 [DELETE USER] Token exists:",
        !!token
      );

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response =
        await apiFetch(
          `/users/${id}?source=${encodeURIComponent(
            source || ""
          )}`,
          {
            method: "DELETE",
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
        data = {};
      }

      console.log(
        "🗑️ [DELETE USER] Response:",
        response.status,
        data
      );

     

      if (response.status === 401) {
        throw new Error(
          "Unauthenticated. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          `Delete failed. HTTP ${response.status}`
        );
      }


      setUsers(
        (prevUsers) =>
          prevUsers.filter(
            (user) =>
              !(
                user.id === id &&
                user.source === source
              )
          )
      );

      alert(
        "User deleted successfully!"
      );

    } catch (error) {
      console.error(
        " [USERS] Delete User Error:",
        error
      );

      alert(
        error.message ||
        "Unable to delete user."
      );
    }
  };

 

  const filteredUsers =
    users.filter((user) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      const name =
        `${user.first_name || ""} ${
          user.last_name || ""
        }`.toLowerCase();

      const email =
        (
          user.email || ""
        ).toLowerCase();

      const role =
        user.role || "";

      const status =
        user.status || "";

      const searchMatch =
        name.includes(searchText) ||
        email.includes(searchText);

      const roleMatch =
        roleFilter === "All" ||
        role === roleFilter;

      const statusMatch =
        statusFilter === "All" ||
        status === statusFilter;

      return (
        searchMatch &&
        roleMatch &&
        statusMatch
      );
    });

  const activeUsers =
    users.filter(
      (user) =>
        user.status === "Active"
    ).length;

  const roles =
    new Set(
      users
        .map(
          (user) =>
            user.role
        )
        .filter(Boolean)
    ).size;

 

  return (
    <div className="users-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>
            Users
          </h1>

          <p>
            Manage users and their system
            access.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/users/add")
          }
        >
          + Add User
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          }}
        >

          <strong>
            Unable to load users:
          </strong>{" "}

          {error}

          <button
            onClick={getUsers}
            style={{
              marginLeft: "15px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>

        </div>
      )}

      {/* STATISTICS */}

      <div className="user-stat-grid">

        <div className="user-stat-card">

          <div className="stat-icon blue">
            👥
          </div>

          <div>

            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>

          </div>

        </div>


        <div className="user-stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>

            <span>
              Active Users
            </span>

            <strong>
              {activeUsers}
            </strong>

          </div>

        </div>


        <div className="user-stat-card">

          <div className="stat-icon purple">
            🛡
          </div>

          <div>

            <span>
              Roles
            </span>

            <strong>
              {roles}
            </strong>

          </div>

        </div>


        <div className="user-stat-card">

          <div className="stat-icon orange">
            🔐
          </div>

          <div>

            <span>
              Permissions
            </span>

            <strong>
              32
            </strong>

          </div>

        </div>

      </div>

      {/* FILTER */}

      <div className="filter-card">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Roles
          </option>

          <option value="Super Admin">
            Super Admin
          </option>

          <option value="HR Manager">
            HR Manager
          </option>

          <option value="Accountant">
            Accountant
          </option>

          <option value="Employee">
            Employee
          </option>

        </select>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>

        </select>

      </div>

      {/* TABLE */}

      <div className="table-card">

        <div className="table-header">

          <div>

            <h3>
              All Users
            </h3>

            <span>
              {filteredUsers.length} users
              found
            </span>

          </div>

        </div>


        <div className="table-responsive">

          {loading ? (

            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              Loading users...
            </div>

          ) : (

            <table className="users-table">

              <thead>

                <tr>
                  <th>
                    User
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Joined
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>
                </tr>

              </thead>


              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                      }}
                    >

                      {error
                        ? "Unable to load users"
                        : "No users found"}

                    </td>

                  </tr>

                ) : (

                  filteredUsers.map(
                    (user) => (

                      <tr
                        key={`${user.source}-${user.id}`}
                      >

                        {/* USER */}

                        <td>

                          <div className="user-cell">

                            <div className="user-avatar">

                              {(
                                user.first_name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div>

                              <strong>

                                {user.first_name ||
                                  ""}{" "}

                                {user.last_name ||
                                  ""}

                              </strong>


                              <span>

                                ID: USER-

                                {String(
                                  user.id
                                ).padStart(
                                  3,
                                  "0"
                                )}

                              </span>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td>

                          <div className="contact-cell">

                            <span>

                              {user.email ||
                                "-"}

                            </span>


                            <small>

                              {user.phone ||
                                "-"}

                            </small>

                          </div>

                        </td>


                        {/* ROLE */}

                        <td>

                          <span className="role-badge">

                            {user.role ||
                              "-"}

                          </span>

                        </td>


                        {/* JOINED */}

                        <td>

                          {user.created_at
                            ? new Date(
                                user.created_at
                              ).toLocaleDateString()
                            : "-"}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              user.status ===
                              "Active"
                                ? "status-badge active"
                                : "status-badge inactive"
                            }
                          >

                            <i></i>

                            {user.status ||
                              "Unknown"}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">

                            <button
                              className="view-btn"
                              title="View"
                              onClick={() =>
                                navigate(
                                  `/users/${user.id}?source=${encodeURIComponent(
                                    user.source || ""
                                  )}`
                                )
                              }
                            >
                              View
                            </button>


                            <button
                              className="edit-btn"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/users/${user.id}/edit?source=${encodeURIComponent(
                                    user.source || ""
                                  )}`
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              className="delete-btn"
                              title="Delete"
                              onClick={() =>
                                deleteUser(
                                  user.id,
                                  user.source
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}
