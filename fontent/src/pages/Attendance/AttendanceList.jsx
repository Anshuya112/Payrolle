
import { useNavigate } from "react-router-dom";
import { useState, useEffect, } from "react";


import axios from "axios";
import "./AttendanceMark.css";

function AttendanceList() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/attendance"
      );

      setAttendance(response.data);

    } catch (error) {
      console.error(error);
    }
  };


    const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/attendance/${id}`);

      alert("Attendance Deleted Successfully");

      fetchAttendance();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to delete attendance");
    }
  };


  const handleSearch = async () => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/attendance?search=${search}`
    );

    setAttendance(response.data);
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="attendance-list-container">
      <div className="attendance-list-card">
        <h2>Attendance List</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Employee ID or Name"
            value={search}
             onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button className="btn11"   onClick={() => navigate("/MarkAttendance")}>
            Add Attendance</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((item, index) => (
              <tr key={index}>
                <td>{item.employee_id}</td>
                <td>{item.employee_name}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`status ${item.status.replace(/\s/g, "")}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.check_in}</td>
                <td>{item.check_out}</td>
           <td>

           <button
                 onClick={() => navigate(`/Attendance/Edit/${item.id}`)}
                   className="edit-btn">Edit
            </button>

            <button className="delete-btn" onClick={() => handleDelete(item.id)}>

              Delete

            </button>

          </td>

          </tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceList;