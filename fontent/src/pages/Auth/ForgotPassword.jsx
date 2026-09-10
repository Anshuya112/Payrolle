import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showOptions, setShowOptions] = useState(false);

 
    const handleFindUser = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        const enteredUsername = username.trim();

        if (!enteredUsername) {
            setError("Please enter your username.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        username: enteredUsername,
                    }),
                }
            );

            const data = await response.json();

            console.log("Find User Response:", data);

            if (!response.ok) {
                if (data.errors) {
                    const firstError =
                        Object.values(data.errors)[0]?.[0];

                    throw new Error(
                        firstError ||
                        data.message ||
                        "User not found."
                    );
                }

                throw new Error(
                    data.message ||
                    "User not found."
                );
            }

            setUsername(enteredUsername);

          
            setShowOptions(true);

            setMessage(
                "Account found. Select where you want to receive the OTP."
            );

        } catch (error) {
            console.error(
                "Forgot Password Error:",
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



    const sendOtp = async (method) => {
        setError("");
        setMessage("");

        const enteredUsername = username.trim();

        if (!enteredUsername) {
            setError("Username is required.");
            return;
        }

     
        if (!["email", "mobile"].includes(method)) {
            setError("Invalid OTP method.");
            return;
        }

        console.log("Sending OTP:", {
            username: enteredUsername,
            method: method,
        });

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/send-reset-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },

                    body: JSON.stringify({
                        username: enteredUsername,
                        method: method,
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "Send OTP Response:",
                data
            );

            if (!response.ok) {
                console.error(
                    "Backend Error:",
                    data
                );

                if (data.errors) {
                    const firstError =
                        Object.values(data.errors)[0]?.[0];

                    throw new Error(
                        firstError ||
                        data.message ||
                        "Unable to send OTP."
                    );
                }

                throw new Error(
                    data.message ||
                    "Unable to send OTP."
                );
            }

            setMessage(
                data.message ||
                "OTP has been sent successfully."
            );

       

            setTimeout(() => {
                navigate(
                    `/verify-reset-otp?username=${encodeURIComponent(
                        enteredUsername
                    )}`
                );
            }, 500);

        } catch (error) {
            console.error(
                "Send OTP Error:",
                error
            );

            setError(
                error.message ||
                "Unable to send OTP."
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2>Forgot Password</h2>

                <p>
                    Enter your username to recover your account.
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

                {!showOptions && (
                    <form onSubmit={handleFindUser}>

                        <div className="form-group">

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
                                placeholder="Enter your username"
                                autoComplete="username"
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Checking..."
                                : "Continue"}
                        </button>

                    </form>
                )}


                {showOptions && (
                    <div className="otp-options">

                        <h3>
                            Where should we send the OTP?
                        </h3>

                        <p>
                            Choose your registered email
                            or mobile number.
                        </p>


                        {/* Email */}

                        <button
                            type="button"
                            onClick={() =>
                                sendOtp("email")
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "📧 Send OTP to Email"}
                        </button>


                        {/* Mobile */}

                        <button
                            type="button"
                            onClick={() =>
                                sendOtp("mobile")
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "📱 Send OTP to Mobile"}
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}