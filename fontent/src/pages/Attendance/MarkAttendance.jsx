import { useState } from "react";
import axios from "axios";
import "./AttendanceMark.css";

function AttendanceMark() {
  const [attendance, setAttendance] = useState({
    employeeId: "",
    employeeName: "",
    date: "",
    status: "",
    checkIn: "",
    checkOut: "",
  });

  const handleChange = (e) => {
    setAttendance({
      ...attendance,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/attendance",
        {
          employee_id: attendance.employeeId,
          employee_name: attendance.employeeName,
          date: attendance.date,
          status: attendance.status,
          check_in: attendance.checkIn,
          check_out: attendance.checkOut,
        }
      );

      alert(response.data.message);

      setAttendance({
        employeeId: "",
        employeeName: "",
        date: "",
        status: "",
        checkIn: "",
        checkOut: "",
      });
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to save attendance");
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <h2>Mark Attendance</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              placeholder="Enter Employee ID"
              value={attendance.employeeId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              placeholder="Enter Employee Name"
              value={attendance.employeeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={attendance.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={attendance.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="Work From Home">Work From Home</option>
            </select>
          </div>

          <div className="time-row">
            <div className="form-group">
              <label>Check In</label>
              <input
                type="time"
                name="checkIn"
                value={attendance.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Check Out</label>
              <input
                type="time"
                name="checkOut"
                value={attendance.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Mark Attendance
          </button>
        </form>
      </div>
    </div>
  );
}

export default AttendanceMark;