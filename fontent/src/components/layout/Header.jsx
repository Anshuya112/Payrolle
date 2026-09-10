import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("payroll_user") || "{}"
  );

  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    user?.username ||
    "Admin User";

  const role =
    user?.roles?.[0]?.name ||
    (user?.source === "adduser" ? "User" : "Super Admin");

  const handleLogout = () => {
    localStorage.removeItem("payroll_auth");
    localStorage.removeItem("payroll_user");

    navigate("/login", { replace: true });
  };

  const getPageName = () => {
    const path = location.pathname;

    if (path === "/" || path === "/dashboard") {
      return "Dashboard";
    }

    if (path.startsWith("/users")) {
      return "Users";
    }

    if (path.startsWith("/roles")) {
      return "Roles";
    }

    if (path.startsWith("/permissions")) {
      return "Permissions";
    }

    if (path.startsWith("/Employee")) {
      return "Employees";
    }

    if (path.startsWith("/Leave")) {
      return "Leave";
    }

    if (path.startsWith("/Salary")) {
      return "Salary";
    }

    if (path.startsWith("/Settings")) {
      return "Settings";
    }

    if (path.startsWith("/Attendance")) {
      return "Attendance";
    }

    if (path.startsWith("/Payroll")) {
      return "Payroll";
    }

    if (path.startsWith("/Overtime")) {
      return "Overtime";
    }

    if (
      path.startsWith("/AddDepartment") ||
      path.startsWith("/Department")
    ) {
      return "Department";
    }

    if (
      path.startsWith("/AddDesignation") ||
      path.startsWith("/Designation")
    ) {
      return "Designation";
    }

    if (path.startsWith("/Loan")) {
      return "Loan";
    }

    if (path.startsWith("/Tax")) {
      return "Tax";
    }

    if (path.startsWith("/Payslip")) {
      return "Payslip";
    }

    if (path.includes("Report")) {
      return "Reports";
    }

    return "Home";
  };

  const pageName = getPageName();

  const avatarLetter =
    fullName.charAt(0).toUpperCase();

  return (
    <header className="top-header">

      <div className="header-left">

        <button
          className="mobile-menu"
          type="button"
        >
          ☰
        </button>

        <div className="breadcrumb">
          <span>Home</span>

          <b>/</b>

          <strong>{pageName}</strong>
        </div>

      </div>


      <div className="header-right">

        <button
          className="header-icon"
          type="button"
          title="Notifications"
        >
          🔔
        </button>


        <div
          className="header-profile"
          onClick={() =>
            setShowProfileMenu(!showProfileMenu)
          }
        >

          <div className="header-avatar">
            {avatarLetter}
          </div>

          <div className="header-user-info">

            <strong>
              {fullName}
            </strong>

            <span>
              {role}
            </span>

          </div>

          <span className="profile-arrow">
            ⌄
          </span>


          {showProfileMenu && (
            <div
              className="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                type="button"
                className="signout-button"
                onClick={handleLogout}
              >
                🚪 Sign Out
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}