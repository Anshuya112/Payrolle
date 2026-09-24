import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function VerifyResetOtp() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const username =
        searchParams.get("username") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/verify-reset-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        otp,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid OTP."
                );
            }

            setMessage(
                "OTP verified successfully."
            );

            // Go to reset password
            setTimeout(() => {
                navigate(
                    `/reset-password?username=${encodeURIComponent(
                        username
                    )}&reset_token=${encodeURIComponent(
                        data.reset_token
                    )}`
                );
            }, 500);

        } catch (error) {
            console.error(
                "OTP Verification Error:",
                error
            );

            setError(
                error.message ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (timer > 0 || resending) return;

        setError("");
        setMessage("");

        try {
            setResending(true);

            const response = await fetch(
                `${API_URL}/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        username,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to resend OTP."
                );
            }

            setMessage("New OTP sent successfully.");
            setTimer(60);

        } catch (error) {
            setError(
                error.message ||
                "Unable to resend OTP."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2>Verify OTP</h2>

                <p>
                    Enter the 6-digit OTP sent to
                    your registered email.
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

                <form onSubmit={handleVerify}>

                    <div className="form-group">
                        <label>OTP</label>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                )
                            }
                            placeholder="Enter 6-digit OTP"
                            autoComplete="one-time-code"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </form>

                <div className="resend-section">

                    {timer > 0 ? (
                        <p>
                            Resend OTP in {timer}s
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={resendOtp}
                            disabled={resending}
                        >
                            {resending
                                ? "Sending..."
                                : "Resend OTP"}
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
}
