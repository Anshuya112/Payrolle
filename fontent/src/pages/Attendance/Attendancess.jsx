import { useState, useEffect } from "react";

import Header from "../../components/Attendance/Header";
import EmployeeInfo from "../../components/Attendance/EmployeeInfo";
import AttendanceCard from "../../components/Attendance/AttendanceCard";
import AttendanceStatus from "../../components/Attendance/AttendanceStatus";
import AttendanceAction from "../../components/Attendance/AttendanceAction";
import AttendanceSummary from "../../components/Attendance/AttendanceSummary";

import "./AttendanceMark.css";

import axios from "axios";



export default function Attendance() {


    const [employeeId, setEmployeeId] = useState("");

    const [employee, setEmployee] = useState(null);


    const [attendance, setAttendance] = useState({

        checkIn:null,
        checkOut:null,
        workingHours:"00h 00m",
        status:"Absent"

    });



    useEffect(()=>{

    const employee =
    JSON.parse(
        localStorage.getItem("employee")
    );


    if(employee){

        axios.get(
        `http://localhost:8000/api/attendance/employee/${employee.employee_id}`
        )
        .then(res=>{


            if(res.data.attendance){

                setAttendance({

                    checkIn:
                    res.data.attendance.check_in,


                    checkOut:
                    res.data.attendance.check_out,


                    workingHours:
                    res.data.attendance.working_hours || "00h 00m",


                    status:
                    res.data.attendance.status

                });

            }


        });


    }


},[]);

  const getAttendance = async () => {

    try {

        const res = await axios.get(
            `http://localhost:8000/api/attendance/employee/${employeeId}`
        );

        setEmployee(res.data.employee);


        if(res.data.attendance){

            setAttendance({

                checkIn: res.data.attendance.check_in,

                checkOut: res.data.attendance.check_out,

                workingHours:
                res.data.attendance.working_hours || "00h 00m",

                status:
                res.data.attendance.status

            });

        }


    } catch(error) {

        console.log(error.response);

        alert("Employee Not Found");

        setEmployee(null);

    }

};   // <-- getAttendance close



const handleCheckIn = async () => {

    if (!employee) {
        alert("Employee not found");
        return;
    }


    try {

        const response = await axios.post(
            "http://localhost:8000/api/attendance/checkin",
            {
                employee_id: employee.employee_id
            }
        );


        console.log(response.data);



        setAttendance(prev => ({

            ...prev,

            checkIn: new Date().toLocaleTimeString(),

            status: "Present"

        }));



        alert(
            response.data.message
        );


    } 
    catch(error) {


        console.log(
            error.response?.data
        );


        alert(
            error.response?.data?.message ||
            "Check In Failed"
        );

    }

};





const handleCheckOut = async () => {


    if (!employee) {
        alert("Employee not found");
        return;
    }



    try {


        const response = await axios.post(

            "http://localhost:8000/api/attendance/checkout",

            {
                employee_id: employee.employee_id
            }

        );



        console.log(response.data);



        setAttendance(prev => ({


            ...prev,


            checkOut:
            new Date().toLocaleTimeString(),


            workingHours:
            response.data.working_hours,


            status:"Present"


        }));



        alert(
            response.data.message
        );


    } 
    catch(error) {


        console.log(
            error.response?.data
        );


        alert(
            error.response?.data?.message ||
            "Check Out Failed"
        );

    }

};







return (

    <div className="attendance-page">

        <div className="attendance-container">


            <Header />


            <div className="employee-search">

                <h3>
                    Employee Attendance
                </h3>


                <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={employeeId}
                    onChange={(e) =>
                        setEmployeeId(e.target.value)
                    }
                />


                <button
                    className="search-btn"
                    onClick={getAttendance}
                >
                    Search
                </button>


            </div>




            {
                employee && (

                    <EmployeeInfo
                        employee={employee}
                    />

                )
            }






            {
                employee && (

                    <>

                        <AttendanceCard
                            attendance={attendance}
                        />



                        <AttendanceStatus
                            status={attendance.status}
                        />



                        <AttendanceAction
                            attendance={attendance}
                            onCheckIn={handleCheckIn}
                            onCheckOut={handleCheckOut}
                        />



                        <AttendanceSummary />


                    </>

                )
            }



        </div>

    </div>

);

}