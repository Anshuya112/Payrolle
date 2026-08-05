import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${email}`);
  };

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial, sans-serif;
        }

        body{
          margin:0;
        }

        .forgot-container{
          height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background :linear-gradient(135deg,rgb(42, 222, 165), #764ba2);
        }

        .forgot-card{
          width:380px;
          background:#fff;
          padding:35px;
          border-radius:15px;
          box-shadow:0 10px 30px rgba(0,0,0,.2);
        }

        .forgot-card h2{
          text-align:center;
          color:#333;
          margin-bottom:10px;
        }

        .forgot-card p{
          text-align:center;
          color:#666;
          font-size:14px;
          margin-bottom:25px;
        }

        .input-group{
          margin-bottom:20px;
        }

        .input-group input{
          width:100%;
          padding:12px;
          border:1px solid #ccc;
          border-radius:8px;
          outline:none;
          font-size:15px;
        }

        .input-group input:focus{
          border-color:#667eea;
        }

        .btn{
          width:100%;
          padding:12px;
          border:none;
          border-radius:8px;
          background:#667eea;
          color:#fff;
          font-size:16px;
          cursor:pointer;
          transition:.3s;
        }

        .btn:hover{
          background:#5563c1;
        }

        .back-login{
          margin-top:20px;
          text-align:center;
        }

        .back-login a{
          color:#667eea;
          text-decoration:none;
          font-size:14px;
        }

        .back-login a:hover{
          text-decoration:underline;
        }
      `}</style>

      <div className="forgot-container">
        <div className="forgot-card">
          <h2>Forgot Password</h2>
          <p>
            Enter your email address and we'll send you a password reset link.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="btn" type="submit">
              Send Reset Link
            </button>
          </form>

          <div className="back-login">
            <a href="/login">← Back to Login</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;