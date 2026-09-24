import {
    Link,
    useLocation,
} from "react-router-dom";
import "./Sidebar.css";

function Unauthorized() {
    const location = useLocation();

    const permission =
        location.state?.permission;

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f7fb",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "12px",
                    textAlign: "center",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <h1
                    style={{
                        color: "#dc2626",
                        marginBottom: "15px",
                    }}
                >
                    Permission Not Allowed
                </h1>

                <p
                    style={{
                        color: "#555",
                        marginBottom: "10px",
                    }}
                >
                    You do not have permission
                    to access this page.
                </p>

                {permission && (
                    <p
                        style={{
                            color: "#777",
                            fontSize: "14px",
                            marginBottom: "25px",
                        }}
                    >
                        Required permission:
                        {" "}
                        <strong>
                            {permission}
                        </strong>
                    </p>
                )}

                <Link
                    to="/dashboard"
                    style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        background: "#2563eb",
                        color: "#ffffff",
                        textDecoration: "none",
                        borderRadius: "6px",
                    }}
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default Unauthorized;
