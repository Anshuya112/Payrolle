import { useState } from "react";
import "./AttendanceReport.css";

function AttendanceReport() {
  const [reports] = useState([
    {
      id: "EMP101",
      name: "Anshu Yadav",
      month: "July",
      year: "2026",
      present: 22,
      absent: 2,
      leave: 1,
    },
    
 
  ]);

  return (
    <div className="report-container">
      <div className="report-card">

        <h2>Attendance Report</h2>

        <div className="filter-section">

          <input
            type="text"
            placeholder="Employee ID"
          />

          <select>
            <option>Month</option>
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

          <select>
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>

          <button>Search</button>

        </div>

        <div className="summary">

          <div className="box present">
            <h3>66</h3>
            <p>Total Present</p>
          </div>

          <div className="box absent">
            <h3>5</h3>
            <p>Total Absent</p>
          </div>

          <div className="box leave">
            <h3>4</h3>
            <p>Total Leave</p>
          </div>

        </div>

        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Month</th>
              <th>Year</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leave</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.month}</td>
                <td>{item.year}</td>
                <td>{item.present}</td>
                <td>{item.absent}</td>
                <td>{item.leave}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default AttendanceReport;