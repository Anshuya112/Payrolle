import { useState } from "react";
import {useNavigate, useSearchParams,} from "react-router-dom";
import "./ResetPassword.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const username =
        searchParams.get("username") || "";

    const resetToken =
        searchParams.get("reset_token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        if (!username || !resetToken) {
            setError(
                "Invalid password reset session."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        reset_token: resetToken,
                        password,
                        password_confirmation:
                            confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to reset password."
                );
            }

            setMessage(
                "Password has been reset successfully."
            );

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.error(
                "Reset Password Error:",
                error
            );

            setError(
                error.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2>Reset Password</h2>

                <p>
                    Create a new password for your account.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter new password"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>

                </form>

            </div>
        </div>
    );
}
