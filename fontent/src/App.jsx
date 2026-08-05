import {  Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ActivityList from "./pages/Dashboard/ActivityList";
import SalaryChart from "./pages/Dashboard/SalaryChart";
import StatusCard from "./pages/Dashboard/StatusCard";

import Sidebar from "./components/layout/Sidebar";

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

import Company from "./pages/Settings/Company";
import SystemSetting from "./pages/Settings/SystemSetting";
import PayrollSetting from "./pages/Settings/PayrollSetting";

import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";

import OvertimeList from "./pages/Overtime/OvertimeList";

import GeneratePayroll from "./pages/Payroll/GeneratePayroll";
import PayrollList from "./pages/Payroll/PayrollList";
import PayrollDetails from "./pages/Payroll/PayrollDetails";
import PayrollHistory from "./pages/Payroll/PayrollHistory";

import AttendanceReport from "./pages/Reports/AttendanceReport";
import EmployeeReport from "./pages/Reports/EmployeeReport";
import SalaryReport from "./pages/Reports/SalaryReport";

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

import TaxCalculation from "./pages/Tax/TaxCalculation";
import TaxReport from "./pages/Tax/TaxReport";

import Permission from "./pages/User&RoleManagement/Permission";
import Role from "./pages/User&RoleManagement/Role";
import UserList from "./pages/User&RoleManagement/UserList";



function App() {
  return (

    
    <Routes>
       
      <Route path="/" element={<Sidebar />}>

        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ActivityList" element={<ActivityList />} />
        <Route path="SalaryChart" element={<SalaryChart />} />
        <Route path="StatusCard" element={<StatusCard />} />


        {/* Employee */}
        <Route path="Employee" element={<EmployeeList />} />
        <Route path="Employees/Create" element={<EmployeeCreate />} />
        <Route path="Employees/Edit/:id" element={<EmployeeEdit />} />
        <Route path="Employees/View/:id" element={<EmployeeView />} />
        <Route path="Employee/Profile/:id" element={<EmployeeProfile />} />
        <Route path="Employee/Documents/:id" element={<EmployeeDocuments />} />
        


        {/* Leave */}
        <Route path="Leave" element={<LeaveList />} />
        <Route path="Leave/Approval" element={<LeaveApproval />} />
        <Route path="Leave/Apply" element={<ApplyLeave />} />


        {/* Salary */}
        <Route path="Salary" element={<SalaryStructur />} />
        <Route path="Salary/Allowances" element={<Allowances />} />
        <Route path="Salary/Deductions" element={<Deductions />} />
        <Route path="Salary/List" element={<SalaryList />} />


        {/* Settings */}
        <Route path="Settings/Company" element={<Company />} />
        <Route path="Settings/Payroll" element={<PayrollSetting />} />
        <Route path="Settings/System" element={<SystemSetting />} />

        {/*Auth*/}
       <Route path="/Forgot/Password" element={<ForgotPassword />} />
        <Route path="Login" element={<Login />} />

        {/*Overtime*/}
        <Route path="Overtime/List" element={<OvertimeList />} />
        
        {/*Payroll*/}
        <Route path="Generate/Payroll" element={<GeneratePayroll />} />
        <Route path="Payroll/List" element={<PayrollList />} />
        <Route path="Payroll/Details" element={<PayrollDetails />} />
        <Route path="PayrollHistory" element={<PayrollHistory />} />

        {/*Reports*/}
        <Route path="AttendanceReport" element={<AttendanceReport />} />
        <Route path="EmployeeReport" element={<EmployeeReport />} />
        <Route path="SalaryReport" element={<SalaryReport />} />

        {/*Attendance*/}
        <Route path="Attendancess" element={<Attendance />} />
        <Route path="AttendanceList" element={<AttendanceList />} />
        <Route path="MarkAttendance" element={<MarkAttendance />} />
        <Route path="Attendance/Edit/:id" element={<AttendanceEdit />} />

        <Route path="AttendanceLogin"element={<AttendanceLogin />}/>
        <Route path="/attendance-dashboard"element={<AttendanceDashboard />} />

        {/*Departments*/}
        <Route path="AddDepartment" element={<AddDepartment />} />
        <Route path="DepartmentList" element={<DepartmentList />} />
        <Route path="EditDepartment" element={<EditDepartment />} />

        {/*Designations*/}
        <Route path="AddDesignation" element={<AddDesignation />} />
        <Route path="DesignationList" element={<DesignationList />} />

        {/*Loan*/}
        <Route path="AddLoan" element={<AddLoan />} />
        <Route path="LoanList" element={<LoanList />} />
        <Route path="LoanPayment" element={<LoanPayment />} />      

        {/*Payslip*/}
        <Route path="DownloadPDF" element={<DownloadPDF />} />
        <Route path="PayslipList" element={<PayslipList />} />
        <Route path="PayslipView" element={<PayslipView />} />

        {/*Tax*/}
        <Route path="TaxCalculation" element={<TaxCalculation />} />
        <Route path="TaxReport" element={<TaxReport />} />

        {/*User&RoleManagement*/}
        <Route path="Permission" element={<Permission />} />
        <Route path="Role" element={<Role />} />
        <Route path="UserList" element={<UserList />} />






      </Route>

    </Routes>
    
  );
}

export default App;