import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login Attempt\nEmail: ${email}`);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .login-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg,rgb(212, 234, 102), #764ba2);
        }

        .login-card {
          width: 380px;
          background: white;
          padding: 35px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .login-card h2 {
          text-align: center;
          color: #333;
          margin-bottom: 10px;
        }

        .login-card p {
          text-align: center;
          color: #777;
          margin-bottom: 25px;
        }

        .input-group {
          margin-bottom: 18px;
        }

        .input-group input {
          width: 100%;
          padding: 13px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          font-size: 15px;
        }

        .input-group input:focus {
          border-color: #667eea;
        }

        .options {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .options a,
        .signup a {
          color: #667eea;
          text-decoration: none;
        }

        button {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 8px;
          background: #667eea;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        button:hover {
          background: #5563c1;
        }

        .signup {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>

              <Link to="/Forgot/Password">Forgot Password?</Link>
            </div>

            <button type="submit">
              Login
            </button>
          </form>

          <div className="signup">
            Don't have an account?
            <a href="#"> Create Account</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;