import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function SelectResetMethod() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const username =
        searchParams.get("username") || "";

    const [methods, setMethods] = useState({
        email: false,
        mobile: false,
    });

    const [selectedMethod, setSelectedMethod] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        if (!username) {
            setError("Invalid username.");
            setLoading(false);
            return;
        }

        const checkUser = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/reset-methods?username=${encodeURIComponent(
                        username
                    )}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Unable to find user."
                    );
                }

                setMethods({
                    email: data.email_available,
                    mobile: data.mobile_available,
                });

            } catch (error) {
                setError(
                    error.message ||
                    "Unable to load reset options."
                );
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [username]);

    const handleSendOtp = async () => {
        if (!selectedMethod) {
            setError(
                "Please select Email or Mobile."
            );
            return;
        }

        try {
            setSending(true);
            setError("");

            const response = await fetch(
                `${API_URL}/send-reset-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Accept:
                            "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        method: selectedMethod,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to send OTP."
                );
            }

            navigate(
                `/verify-reset-otp?username=${encodeURIComponent(
                    username
                )}&method=${selectedMethod}`
            );

        } catch (error) {
            setError(
                error.message ||
                "Unable to send OTP."
            );
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2>
                    Choose OTP Method
                </h2>

                <p>
                    Select where you want to
                    receive your OTP.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="reset-methods">

                    {methods.email && (
                        <label
                            className={
                                `method-option ${
                                    selectedMethod ===
                                    "email"
                                        ? "selected"
                                        : ""
                                }`
                            }
                        >
                            <input
                                type="radio"
                                name="method"
                                value="email"
                                checked={
                                    selectedMethod ===
                                    "email"
                                }
                                onChange={() =>
                                    setSelectedMethod(
                                        "email"
                                    )
                                }
                            />

                            <div>
                                <strong>
                                    Email
                                </strong>

                                <span>
                                    Send OTP to
                                    registered email
                                </span>
                            </div>
                        </label>
                    )}

                    {methods.mobile && (
                        <label
                            className={
                                `method-option ${
                                    selectedMethod ===
                                    "mobile"
                                        ? "selected"
                                        : ""
                                }`
                            }
                        >
                            <input
                                type="radio"
                                name="method"
                                value="mobile"
                                checked={
                                    selectedMethod ===
                                    "mobile"
                                }
                                onChange={() =>
                                    setSelectedMethod(
                                        "mobile"
                                    )
                                }
                            />

                            <div>
                                <strong>
                                    Mobile
                                </strong>

                                <span>
                                    Send OTP to
                                    registered mobile
                                </span>
                            </div>
                        </label>
                    )}

                </div>

                <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sending}
                >
                    {sending
                        ? "Sending OTP..."
                        : "Send OTP"}
                </button>

            </div>
        </div>
    );
}