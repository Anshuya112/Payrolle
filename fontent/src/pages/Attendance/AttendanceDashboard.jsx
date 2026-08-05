import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AttendanceMark.css";

export default function AttendanceDashboard() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem("employee"));

    if (storedEmployee) {
      setEmployee(storedEmployee);
    } else {
      navigate("/attendance-login");
    }
  }, [navigate]);

  const handleCheckIn = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/attendance/checkin",
        {
          employee_id: employee.employee_id,
        }
      );

      alert("Check In Successful");
    } catch (error) {
      console.error(error);
      alert("Check In Failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/attendance/checkout",
        {
          employee_id: employee.employee_id,
        }
      );

      alert("Check Out Successful");
    } catch (error) {
      console.error(error);
      alert("Check Out Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    navigate("/attendance-login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Attendance Dashboard</h2>

        {employee && (
          <>
            <div className="employee-info">
              <h3>{employee.name}</h3>
             
             <p>
                <strong>Name:</strong>{employee.name}
             </p>

              <p>
                <strong>Employee ID:</strong> {employee.employee_id}
              </p>

              <p>
                <strong>Department:</strong> {employee.department}
              </p>

              <p>
                <strong>Designation:</strong> {employee.designation}
              </p>
            </div>

            <div className="button-group">
              <button
                className="checkin-btn"
                onClick={handleCheckIn}
              >
                Check In
              </button>

              <button
                className="checkout-btn"
                onClick={handleCheckOut}
              >
                Check Out
              </button>

              <button
                 type="button"
                 className="logout-btn"
                onClick={() => navigate("/AttendanceLogin")}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}