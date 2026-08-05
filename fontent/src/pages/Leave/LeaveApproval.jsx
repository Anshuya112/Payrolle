import "./ApplyLeave.css";

const leaveRequests = [
  {
    id: 1,
    employeeId: "EMP001",
    employee: "Anshu Yadav",
    type: "Casual Leave",
    from: "25 Jul 2026",
    to: "27 Jul 2026",
    days: 3,
    reason: "Family Function",
    status: "Pending",
  },
];

export default function LeaveApproval() {
  return (
    <div className="approval-container">
      <div className="approval-card">
        <h2>Leave Approval</h2>

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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests.map((leave) => (
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
                <td>
                  <button className="approve-btn">Approve</button>
                  <button className="reject-btn">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}