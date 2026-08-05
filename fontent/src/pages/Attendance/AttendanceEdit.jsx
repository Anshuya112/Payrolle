


import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AttendanceMark.css";

function AttendanceEdit() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState({
    employeeId: "",
    employeeName: "",
    date: "",
    status: "",
    checkIn: "",
    checkOut: "",
  });


  // Get single attendance data
  useEffect(() => {
    fetchAttendance();
  }, []);


  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/attendance/${id}`
      );

      const data = response.data;

      setAttendance({
        employeeId: data.employee_id,
        employeeName: data.employee_name,
        date: data.date,
        status: data.status,
        checkIn: data.check_in,
        checkOut: data.check_out,
      });

    } catch (error) {
      console.log(error);
    }
  };


  const handleChange = (e) => {
    setAttendance({
      ...attendance,
      [e.target.name]: e.target.value,
    });
  };


  // Update attendance
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.put(
        `http://127.0.0.1:8000/api/attendance/${id}`,
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

      navigate("/AttendanceList");


    } catch (error) {

      console.error(error.response?.data || error);

      alert("Failed to update attendance");

    }
  };


  return (
    <div className="attendance-container">

      <div className="attendance-card">

        <h2>Edit Attendance</h2>


        <form onSubmit={handleSubmit}>


          <div className="form-group">
            <label>Employee ID</label>

            <input
              type="text"
              name="employeeId"
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

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Half Day">
                Half Day
              </option>

              <option value="Work From Home">
                Work From Home
              </option>


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
            Update Attendance
          </button>


        </form>


      </div>

    </div>
  );
}


export default AttendanceEdit;