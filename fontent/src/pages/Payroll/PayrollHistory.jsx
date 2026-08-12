// PayrollHistory.jsx

import { useState } from "react";
import "./GeneratePayroll.css";

const PayrollHistory = () => {
  const historyData = [
    {
      id: 1,
      month: "August",
      year: "2026",
      employee: "John Smith",
      employeeId: "EMP001",
      department: "IT",
      salary: 52000,
      status: "Paid",
    },
    {
      id: 2,
      month: "July",
      year: "2026",
      employee: "Sarah Johnson",
      employeeId: "EMP002",
      department: "HR",
      salary: 47000,
      status: "Paid",
    },
    {
      id: 3,
      month: "June",
      year: "2026",
      employee: "David Lee",
      employeeId: "EMP003",
      department: "Finance",
      salary: 61000,
      status: "Paid",
    },
    {
      id: 4,
      month: "May",
      year: "2026",
      employee: "Emma Brown",
      employeeId: "EMP004",
      department: "Sales",
      salary: 45000,
      status: "Pending",
    },
  ];

  const [month, setMonth] = useState("All");
  const [year, setYear] = useState("All");

  const filteredHistory = historyData.filter((item) => {
    const monthMatch = month === "All" || item.month === month;
    const yearMatch = year === "All" || item.year === year;

    return monthMatch && yearMatch;
  });

  return (
    <div className="payroll-container">

      <div className="page-header">
        <h2>Payroll History</h2>
        <p>View previously generated payroll records.</p>
      </div>

      {/* Filter Section */}

      <div className="card payroll-filter-card">

        <div className="payroll-filter-grid">

          <div className="form-group">
            <label>Month</label>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option>All</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option>All</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
            </select>
          </div>

        </div>

      </div>

      {/* History Table */}

      <div className="card table-card">

        <div className="table-responsive">

          <table className="payroll-table">

            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Month</th>
                <th>Year</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.employeeId}</td>
                  <td>{item.employee}</td>
                  <td>{item.department}</td>
                  <td>{item.month}</td>
                  <td>{item.year}</td>
                  <td>₹ {item.salary.toLocaleString()}</td>

                  <td>
                    <span
                      className={`status-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>

                    <button className="table-btn">
                      View
                    </button>

                    <button
                      className="table-btn download-btn"
                      style={{ marginLeft: "10px" }}
                    >
                      Download
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default PayrollHistory;