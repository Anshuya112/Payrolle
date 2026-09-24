import { useLocation, useNavigate } from "react-router-dom";

function AccessDenied() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "30px",
      }}
    >
      <h1 style={{ color: "#dc3545" }}>
        Access Denied
      </h1>

      <h3>
        You do not have permission to access this page.
      </h3>

      {location.state?.permission && (
        <p>
          Required Permission:{" "}
          <strong>
            {location.state.permission}
          </strong>
        </p>
      )}

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          background: "#0d6efd",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default AccessDenied;
