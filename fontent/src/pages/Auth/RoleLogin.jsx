import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function RoleLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        
        setError("");
    };

    
    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        
        if (!formData.role) {
            setError("Please select a role");
            return;
        }

        if (!formData.email) {
            setError("Please enter your email");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8000/api/role-login",
                {
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }
            );

            const { token, user } = response.data;

           
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            
            switch (user.role) {
                case "super_admin":
                    navigate("/admin/dashboard");
                    break;

                case "hr":
                    navigate("/hr/dashboard");
                    break;

                case "employee":
                    navigate("/employee/dashboard");
                    break;

                default:
                    setError("Invalid user role");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="role-login-page">
            <div className="role-login-card">

                
                <div className="role-login-header">
                    <h2>Role Login</h2>
                    <p>Login to access your dashboard</p>
                </div>

                
                <form
                    className="role-login-form"
                    onSubmit={handleLogin}
                >

                    
                    <div className="role-login-field">
                        <label htmlFor="role">
                            Select Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Role
                            </option>

                            <option value="super_admin">
                                Super Admin
                            </option>

                            <option value="hr">
                                HR
                            </option>

                            <option value="employee">
                                Employee
                            </option>
                        </select>
                    </div>

                    
                    <div className="role-login-field">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    
                    <div className="role-login-field">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    
                    {error && (
                        <p className="role-login-error">
                            {error}
                        </p>
                    )}

                    
                    <button
                        type="submit"
                        className="role-login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                
                <div className="role-login-footer">
                    Secure Role Based Login
                </div>

            </div>
        </div>
    );
}