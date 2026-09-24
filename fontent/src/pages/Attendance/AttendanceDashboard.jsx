import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceCard from "../../components/Attendance/AttendanceCard";
import axios from "axios";
import "./AttendanceMark.css";

export default function AttendanceDashboard() {
  const [employee, setEmployee] = useState(null);
  const [showAttendanceCard, setShowAttendanceCard] = useState(false);
  const navigate = useNavigate();
  const [attendance,setAttendance] = useState({

    checkIn:null,

    checkOut:null,

    workingHours:"00h 00m",

    status:"Absent"

});

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

    const response = await axios.post(
      "http://127.0.0.1:8000/api/attendance/checkin",
      {
        employee_id: employee.employee_id,
      }
    );

    setAttendance((prev) => ({
      ...prev,

      checkIn:
        response.data.attendance?.check_in ||
        response.data.check_in ||
        new Date().toLocaleTimeString(),

      status: "Present",
    }));

    alert(response.data.message);

  } catch (error) {

    console.log("Error:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Check In Failed"
    );

  }
};

const handleCheckOut = async () => {

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/api/attendance/checkout",
      {
        employee_id: employee.employee_id,
      }
    );

    setAttendance(prev => ({

            ...prev,

            checkOut:
            response.data.attendance?.check_out ||
            response.data.check_out,


            workingHours:
            response.data.attendance?.working_hours ||
            response.data.working_hours ||
            "00h 00m",


            status:"Present"

        }));


    alert("Check Out Successful");


          setAttendance({

       checkIn:employee.check_in,

       checkOut:
       response.data.check_out,

       workingHours:
       response.data.working_hours,

       status:"Present"

      });


    setShowAttendanceCard(true);


  } catch(error){


    console.log(
      error.response?.data
    );

    alert("Check Out Failed");

  }

};

  const handleLogout = () => {

    localStorage.removeItem("employee");

    navigate("/attendance-login", {
        replace: true
    });

};
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Attendance Dashboard</h2>

        {employee && (
          <>
            <div className="employee-info">
             <h3>
              {employee.first_name} {employee.last_name}
             </h3>

             
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
                          className="cancel-btn"
                          onClick={() => navigate("/AttendanceLogin")}
                   >
                    Logout
                   </button>
            </div>

              {
               showAttendanceCard && (

                  <AttendanceCard
                      attendance={attendance}
                  />

               )
              }

          </>
        )}
      </div>
    </div>
  );
}