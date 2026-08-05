import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [openMenu, setOpenMenu] = useState("");

  const menus = [
    {
      title: "Dashboard",
      submenu: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Activity List", path: "/ActivityList" },
        { name: "Salary Chart", path: "/SalaryChart" },
        { name: "Status Card", path: "/StatusCard" },
      ],
    },

    {
      title: "Employees",
      submenu: [
        { name: "Employee List", path: "/Employee" },
        { name: "Create Employee", path: "/Employees/Create" },
      ],
    },

    {
      title: "Leave",
      submenu: [
        { name: "Leave List", path: "/Leave" },
        { name: "Apply Leave", path: "/Leave/Apply" },
        { name: "Leave Approval", path: "/Leave/Approval" },
      ],
    },

    {
      title: "Salary",
      submenu: [
        { name: "Salary Structure", path: "/Salary" },
        { name: "Allowances", path: "/Salary/Allowances" },
        { name: "Deductions", path: "/Salary/Deductions" },
        { name: "Salary List", path: "/Salary/List" },
      ],
    },

    {
      title: "Payroll",
      submenu: [
        { name: "Generate Payroll", path: "/Generate/Payroll" },
        { name: "Payroll List", path: "/Payroll/List" },
        { name: "Payroll Details", path: "/Payroll/Details" },
        { name: "Payroll History", path: "/PayrollHistory" },
      ],
    },

    {
      title: "Attendance",
      submenu: [
        { name: "Attendance", path: "/Attendancess" },
        { name: "Attendance List", path: "/AttendanceList" },
        { name: "Mark Attendance", path: "/MarkAttendance" },
        {name: "AttendanceLogin", path: "/AttendanceLogin" },
      ],
    },

    {
      title: "Departments",
      submenu: [
        { name: "Department List", path: "/DepartmentList" },
        { name: "Add Department", path: "/AddDepartment" },
      ],
    },

    {
      title: "Designations",
      submenu: [
        { name: "Designation List", path: "/DesignationList" },
        { name: "Add Designation", path: "/AddDesignation" },
      ],
    },

    {
      title: "Loan",
      submenu: [
        { name: "Loan List", path: "/LoanList" },
        { name: "Add Loan", path: "/AddLoan" },
        { name: "Loan Payment", path: "/LoanPayment" },
      ],
    },

    {
      title: "Payslip",
      submenu: [
        { name: "Payslip List", path: "/PayslipList" },
        { name: "Download PDF", path: "/DownloadPDF" },
      ],
    },

    {
      title: "Reports",
      submenu: [
        { name: "Attendance Report", path: "/AttendanceReport" },
        { name: "Employee Report", path: "/EmployeeReport" },
        { name: "Salary Report", path: "/SalaryReport" },
      ],
    },

    {
      title: "Tax",
      submenu: [
        { name: "Tax Calculation", path: "/TaxCalculation" },
        { name: "Tax Report", path: "/TaxReport" },
      ],
    },

    {
      title: "User & Role",
      submenu: [
        { name: "Users", path: "/UserList" },
        { name: "Roles", path: "/Role" },
        { name: "Permission", path: "/Permission" },
      ],
    },

    {
      title: "Settings",
      submenu: [
        { name: "Company", path: "/Settings/Company" },
        { name: "Payroll Setting", path: "/Settings/Payroll" },
        { name: "System Setting", path: "/Settings/System" },
      ],
    },
  ];

  const toggleMenu = (title) => {
    setOpenMenu(openMenu === title ? "" : title);
  };

  return (

    <div className="layout">


      <aside className="sidebar">


        <h2 className="logo">
          Payroll
        </h2>



        {
          menus.map((menu)=>(

            <div key={menu.title}>


              <div
                className="menu-title"
                onClick={() =>
                  setOpenMenu(
                    openMenu === menu.title
                    ? null
                    : menu.title
                  )
                }
              >

                {menu.title}

              </div>



              {
                openMenu === menu.title && (

                  <div className="submenu">


                    {
                      menu.submenu.map((item)=>(

                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({isActive}) =>
                            isActive
                            ? "submenu-link active"
                            : "submenu-link"
                          }
                        >

                          {item.name}

                        </NavLink>

                      ))
                    }


                  </div>

                )
              }


            </div>

          ))
        }


      </aside>



      <main className="content">

        <Outlet />

      </main>


    </div>

  );

}

export default Sidebar;