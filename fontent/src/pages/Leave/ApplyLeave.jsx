import { useState } from "react";
import "./ApplyLeave.css";

function ApplyLeave() {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Leave Applied Successfully!");
  };

  return (
    <div className="leave-container">
      <div className="leave-card">
        <h2>Apply Leave</h2>

        <form onSubmit={handleSubmit}>

          {/* Employee ID */}
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              placeholder="Enter Employee ID"
              value={formData.employeeId}
              onChange={handleChange}required 
            />
          </div>

          {/* Employee Name */}
          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              placeholder="Enter Employee Name"
              value={formData.employeeName}
              onChange={handleChange}required
            />
          </div>

          {/* Leave Type */}
          <div className="form-group">
            <label>Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}required>

              <option value="">Select Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Earned">Earned Leave</option>
              <option value="Work From Home">Work From Home</option>
            </select>
          </div>

          {/* From & To Date */}
          <div className="date-row">
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}required
              />
            </div>

            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div className="form-group">
            <label>Reason</label>
            <textarea
              name="reason"
              rows="4"
              placeholder="Enter reason for leave..."
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Apply Leave
          </button>

        </form>
      </div>
    </div>
  );
}

export default ApplyLeave;