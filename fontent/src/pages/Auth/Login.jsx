import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  saveLogin,
  isAuthenticated,
} from "../../utils/auth";

import "./Login.css";

const API_BASE =
  "http://127.0.0.1:8000/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    if (isAuthenticated()) {

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    }

  }, [navigate]);
const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `${API_BASE}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
        "Invalid username or password."
      );
    }

    /*
     * IMPORTANT
     *
     * Save complete authentication object.
     */

    saveLogin({
      token: data.token,
      access_token: data.access_token,
      user: data.user,
      role: data.user?.role,
      roles: data.user?.roles,
      source: data.user?.source,
    });

    /*
     * Optional compatibility storage
     */

    localStorage.setItem(
      "payroll_user",
      JSON.stringify(data.user)
    );

    /*
     * Go to dashboard only once
     */

    navigate("/dashboard", {
      replace: true,
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    setError(
      error.message ||
      "Unable to login."
    );

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-card">

          <div className="login-logo">

            <div className="login-logo-icon">
              👤
            </div>

            <h1>
              Payroll Management
            </h1>

            <p>
              Sign in to your account
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <div className="login-group">

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                placeholder="Enter username"
                autoComplete="username"
                disabled={loading}
              />

            </div>


            <div className="login-group">

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>


          <div className="login-footer">

            <span>
              Secure Payroll System
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
