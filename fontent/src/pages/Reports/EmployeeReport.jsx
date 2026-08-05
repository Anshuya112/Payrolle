import { useState } from "react";
import "./AttendanceReport.css";

function EmployeeReport() {
  const [employees] = useState([
    {
      id: "EMP101",
      name: "Anshu Yadav",
      department: "HR",
      designation: "HR Manager",
      salary: "50000",
      status: "Active",
    },

  ]);

  return (
    <div className="employee-report-container">
      <div className="employee-report-card">

        <h2>Employee Report</h2>

        <div className="filter-section">

          <input
            type="text"
            placeholder="Search Employee ID"
          />

          <input
            type="text"
            placeholder="Employee Name"
          />

          <select>
            <option>All Departments</option>
            <option>HR</option>
            <option>IT</option>
            <option>Finance</option>
            <option>Sales</option>
          </select>

          <button>Search</button>

        </div>

        <div className="summary-cards">

          <div className="summary-card total">
            <h3>4</h3>
            <p>Total Employees</p>
          </div>

          <div className="summary-card active">
            <h3>3</h3>
            <p>Active Employees</p>
          </div>

          <div className="summary-card inactive">
            <h3>1</h3>
            <p>Inactive Employees</p>
          </div>

        </div>

        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr key={index}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>₹ {emp.salary}</td>
                <td>
                  <span
                    className={
                      emp.status === "Active"
                        ? "status active-status"
                        : "status inactive-status"
                    }
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default EmployeeReport;