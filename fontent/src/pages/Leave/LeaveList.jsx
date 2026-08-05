import { Link } from "react-router-dom";
import "./ApplyLeave.css";

const leaveList = [
  {
    id: 1,
    employeeId: "EMP001",
    employee: "Anshu Yadav",
    type: "Casual Leave",
    from: "25 Jul 2026",
    to: "27 Jul 2026",
    days: 3,
    reason: "Family Function",
    status: "Approved",
  },

];

export default function LeaveList() {
  return (
    <div className="approval-container">
      <div className="approval-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}>
            
          <h2>Leave List</h2>

          <Link to="/Leave/Apply" className="approve-btn">+ Apply Leave`````</Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {leaveList.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employeeId}</td>
                <td>{leave.employee}</td>
                <td>{leave.type}</td>
                <td>{leave.from}</td>
                <td>{leave.to}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={leave.status.toLowerCase()}>
                    {leave.status}
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