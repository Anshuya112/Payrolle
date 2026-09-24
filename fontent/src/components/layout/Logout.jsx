import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  logoutUser,
} from "../../utils/auth";

import "./Sidebar.css";

export default function Logout() {

  const navigate =
    useNavigate();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  const handleLogout = () => {

    setLoggingOut(true);

    logoutUser();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  return (
    <div className="logout-page">

      <div className="logout-card">

        <div className="logout-icon">
          🔐
        </div>

        <h1>
          Logout
        </h1>

        <p>
          Are you sure you want to logout?
        </p>


        <div className="logout-actions">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            disabled={loggingOut}
            className="logout-cancel"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="logout-confirm"
          >
            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>

        </div>

      </div>

    </div>
  );
}
