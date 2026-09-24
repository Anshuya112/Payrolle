import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import Dashboard from "./pages/Dashboard/Dashboard";
import ActivityList from "./pages/Dashboard/ActivityList";
import SalaryChart from "./pages/Dashboard/SalaryChart";
import StatusCard from "./pages/Dashboard/StatusCard";


import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Logout from "./components/layout/Logout";
import Unauthorized from "./components/layout/Unauthorized";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import AuthSync from "./components/layout/AuthSync";


import AccessDenied from "./context/AccessDenied";


import Login from "./pages/Auth/Login";
import RoleLogin from "./pages/Auth/RoleLogin";

import EmployeeCreate from "./pages/Employees/EmployeeCreate";
import EmployeeEdit from "./pages/Employees/EmployeeEdit";
import EmployeeList from "./pages/Employees/EmployeeList";
import EmployeeView from "./pages/Employees/EmployeeView";
import EmployeeProfile from "./pages/Employees/EmployeeProfile";
import EmployeeDocuments from "./pages/Employees/EmployeeDocuments";


import LeaveApproval from "./pages/Leave/LeaveApproval";
import LeaveList from "./pages/Leave/LeaveList";
import ApplyLeave from "./pages/Leave/ApplyLeave";


import Allowances from "./pages/Salary/Allowances";
import Deductions from "./pages/Salary/Deductions";
import SalaryStructur from "./pages/Salary/SalaryStructur";
import SalaryList from "./pages/Salary/SalaryList";


import GeneratePayroll from "./pages/Payroll/GeneratePayroll";
import PayrollList from "./pages/Payroll/PayrollList";
import PayrollDetails from "./pages/Payroll/PayrollDetails";
import PayrollHistory from "./pages/Payroll/PayrollHistory";
import Payslip from "./pages/Payroll/Payslip";


import Attendance from "./pages/Attendance/Attendancess";
import AttendanceList from "./pages/Attendance/AttendanceList";
import MarkAttendance from "./pages/Attendance/MarkAttendance";
import AttendanceEdit from "./pages/Attendance/AttendanceEdit";
import AttendanceLogin from "./pages/Attendance/AttendanceLogin";
import AttendanceDashboard from "./pages/Attendance/AttendanceDashboard";


import AddDepartment from "./pages/Departments/AddDepartment";
import DepartmentList from "./pages/Departments/DepartmentList";
import EditDepartment from "./pages/Departments/EditDepartment";


import AddDesignation from "./pages/Designations/AddDesignation";
import DesignationList from "./pages/Designations/DesignationList";

import AddLoan from "./pages/Loan/AddLoan";
import LoanList from "./pages/Loan/LoanList";
import LoanPayment from "./pages/Loan/LoanPayment";


import DownloadPDF from "./pages/Payslip/DownloadPDF";
import PayslipList from "./pages/Payslip/PayslipList";
import PayslipView from "./pages/Payslip/PayslipView";

import AttendanceReport from "./pages/Reports/AttendanceReport";
import EmployeeReport from "./pages/Reports/EmployeeReport";
import SalaryReport from "./pages/Reports/SalaryReport";


import TaxCalculation from "./pages/Tax/TaxCalculation";
import TaxReport from "./pages/Tax/TaxReport";

import Permission from "./pages/User&RoleManagement/Permission";
import Role from "./pages/User&RoleManagement/Role";

import AddUser from "./pages/User&RoleManagement/AddUser";
import EditUser from "./pages/User&RoleManagement/EditUser";
import ViewUser from "./pages/User&RoleManagement/ViewUser";
import UserList from "./pages/User&RoleManagement/UserList";

import AddRole from "./pages/User&RoleManagement/AddRole";
import EditRole from "./pages/User&RoleManagement/EditRole";

import AddPermission from "./pages/User&RoleManagement/AddPermission";
import EditPermission from "./pages/User&RoleManagement/EditPermission";

import Company from "./pages/Settings/Company";
import SystemSetting from "./pages/Settings/SystemSetting";
import PayrollSetting from "./pages/Settings/PayrollSetting";

import OvertimeList from "./pages/Overtime/OvertimeList";


function PublicLoginRoute() {
  const auth = localStorage.getItem("payroll_auth");

  if (auth) {
    try {
      const parsedAuth = JSON.parse(auth);

      if (parsedAuth?.token) {
        return (
          <Navigate
            to="/dashboard"
            replace
          />
        );
      }
    } catch (error) {
      console.error(
        "[AUTH] Invalid payroll_auth:",
        error
      );

      localStorage.removeItem("payroll_auth");
    }
  }

  return <Login />;
}

export default function App() {
 return (
  <>
    <AuthSync />

    <Routes>

      <Route path="/login" element={<PublicLoginRoute />} />
      <Route path="/role-login" element={<RoleLogin />} />
      <Route path="/unauthorized" element={<Unauthorized />} />


      <Route path="/" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="header" element={<ProtectedRoute><Header /></ProtectedRoute>} />


        <Route path="access-denied" element={<ProtectedRoute><AccessDenied /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="ActivityList" element={<ProtectedRoute><ActivityList /></ProtectedRoute>} />
        <Route path="SalaryChart" element={<ProtectedRoute><SalaryChart /></ProtectedRoute>} />
        <Route path="StatusCard" element={<ProtectedRoute><StatusCard /></ProtectedRoute>} />


        <Route path="Employee" element={<ProtectedRoute permission="employee.view"><EmployeeList /></ProtectedRoute>} />
        <Route path="Employees/Create" element={<ProtectedRoute permission="employee.create"><EmployeeCreate /></ProtectedRoute>} />
        <Route path="Employees/Edit/:id" element={<ProtectedRoute permission="employee.edit"><EmployeeEdit /></ProtectedRoute>} />
        <Route path="Employees/View/:id" element={<ProtectedRoute permission="employee.view"><EmployeeView /></ProtectedRoute>} />
        <Route path="Employee/Profile/:id" element={<ProtectedRoute permission="employee.view"><EmployeeProfile /></ProtectedRoute>} />
        <Route path="Employee/Documents/:id" element={<ProtectedRoute permission="employee.view"><EmployeeDocuments /></ProtectedRoute>} />


        <Route path="Leave" element={<ProtectedRoute permission="leave.view"><LeaveList /></ProtectedRoute>} />
        <Route path="Leave/Approval" element={<ProtectedRoute permission="leave.approve"><LeaveApproval /></ProtectedRoute>} />
        <Route path="Leave/Apply" element={<ProtectedRoute permission="leave.create"><ApplyLeave /></ProtectedRoute>} />
        <Route path="Salary" element={<ProtectedRoute permission="salary.view"><SalaryStructur /></ProtectedRoute>} />
        <Route path="Salary/Allowances" element={<ProtectedRoute permission="salary.allowances"><Allowances /></ProtectedRoute>} />
        <Route path="Salary/Deductions" element={<ProtectedRoute permission="salary.deductions"><Deductions /></ProtectedRoute>} />
        <Route path="Salary/List" element={<ProtectedRoute permission="salary.view"><SalaryList /></ProtectedRoute>} />



        <Route path="Generate/Payroll" element={<ProtectedRoute permission="payroll.create"><GeneratePayroll /></ProtectedRoute>} />
        <Route path="Payroll/List" element={<ProtectedRoute permission="payroll.view"><PayrollList /></ProtectedRoute>} />
        <Route path="Payroll/Details" element={<ProtectedRoute permission="payroll.view"><PayrollDetails /></ProtectedRoute>} />
        <Route path="PayrollHistory" element={<ProtectedRoute permission="payroll.history"><PayrollHistory /></ProtectedRoute>} />
        <Route path="Payslip" element={<ProtectedRoute permission="payslip.view"><Payslip /></ProtectedRoute>} />


        <Route path="Attendancess" element={<ProtectedRoute permission="attendance.view"><Attendance /></ProtectedRoute>} />
        <Route path="AttendanceList" element={<ProtectedRoute permission="attendance.view"><AttendanceList /></ProtectedRoute>} />
        <Route path="MarkAttendance" element={<ProtectedRoute permission="attendance.create"><MarkAttendance /></ProtectedRoute>} />
        <Route path="Attendance/Edit/:id" element={<ProtectedRoute permission="attendance.edit"><AttendanceEdit /></ProtectedRoute>} />
        <Route path="AttendanceLogin" element={<ProtectedRoute permission="attendance.login"><AttendanceLogin /></ProtectedRoute>} />
        <Route path="attendance-dashboard" element={<ProtectedRoute permission="attendance.dashboard"><AttendanceDashboard /></ProtectedRoute>} />


        <Route path="AddDepartment" element={<ProtectedRoute permission="department.create"><AddDepartment /></ProtectedRoute>} />
        <Route path="DepartmentList" element={<ProtectedRoute permission="department.view"><DepartmentList /></ProtectedRoute>} />
        <Route path="EditDepartment" element={<ProtectedRoute permission="department.edit"><EditDepartment /></ProtectedRoute>} />


        <Route path="AddDesignation" element={<ProtectedRoute permission="designation.create"><AddDesignation /></ProtectedRoute>} />
        <Route path="DesignationList" element={<ProtectedRoute permission="designation.view"><DesignationList /></ProtectedRoute>} />


        <Route path="AddLoan" element={<ProtectedRoute permission="loan.create"><AddLoan /></ProtectedRoute>} />
        <Route path="LoanList" element={<ProtectedRoute permission="loan.view"><LoanList /></ProtectedRoute>} />
        <Route path="LoanPayment" element={<ProtectedRoute permission="loan.payment"><LoanPayment /></ProtectedRoute>} />


        <Route path="DownloadPDF" element={<ProtectedRoute permission="payslip.download"><DownloadPDF /></ProtectedRoute>} />
        <Route path="PayslipList" element={<ProtectedRoute permission="payslip.view"><PayslipList /></ProtectedRoute>} />
        <Route path="PayslipView" element={<ProtectedRoute permission="payslip.view"><PayslipView /></ProtectedRoute>} />


        <Route path="AttendanceReport" element={<ProtectedRoute permission="report.attendance"><AttendanceReport /></ProtectedRoute>} />
        <Route path="EmployeeReport" element={<ProtectedRoute permission="report.employee"><EmployeeReport /></ProtectedRoute>} />
        <Route path="SalaryReport" element={<ProtectedRoute permission="report.salary"><SalaryReport /></ProtectedRoute>} />


        <Route path="TaxCalculation" element={<ProtectedRoute permission="tax.view"><TaxCalculation /></ProtectedRoute>} />
        <Route path="TaxReport" element={<ProtectedRoute permission="tax.report"><TaxReport /></ProtectedRoute>} />


        <Route path="Permission" element={<ProtectedRoute permission="permission.view"><Permission /></ProtectedRoute>} />
        <Route path="permissions/add" element={<ProtectedRoute permission="permission.create"><AddPermission /></ProtectedRoute>} />
        <Route path="permissions/edit/:id" element={<ProtectedRoute permission="permission.edit"><EditPermission /></ProtectedRoute>} />
        <Route path="Role" element={<ProtectedRoute permission="role.view"><Role /></ProtectedRoute>} />
        <Route path="roles/add" element={<ProtectedRoute permission="role.create"><AddRole /></ProtectedRoute>} />
        <Route path="roles/edit/:id" element={<ProtectedRoute permission="role.edit"><EditRole /></ProtectedRoute>} />
        <Route path="UserList" element={<ProtectedRoute permission="user.view"><UserList /></ProtectedRoute>} />
        <Route path="users/add" element={<ProtectedRoute permission="user.create"><AddUser /></ProtectedRoute>} />
        <Route path="users/:id" element={<ProtectedRoute permission="user.view"><ViewUser /></ProtectedRoute>} />
        <Route path="users/:id/edit" element={<ProtectedRoute permission="user.edit"><EditUser /></ProtectedRoute>} />


        <Route path="Settings/Company" element={<ProtectedRoute permission="settings.company"><Company /></ProtectedRoute>} />
        <Route path="Settings/Payroll" element={<ProtectedRoute permission="settings.payroll"><PayrollSetting /></ProtectedRoute>} />
        <Route path="Settings/System" element={<ProtectedRoute permission="settings.system"><SystemSetting /></ProtectedRoute>} />


        <Route path="Overtime/List" element={<ProtectedRoute permission="overtime.view"><OvertimeList /></ProtectedRoute>} />


        <Route path="logout" element={<Logout />} />
        <Route path="Logout" element={<Navigate to="/logout" replace />} />

      </Route>


      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </>
);

}
