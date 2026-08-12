import "./AttendanceAction.css";


export default function AttendanceSummary({
    attendance = {}
}) {


    return (

        <div className="summary-card">

            <h3>
                Attendance Summary
            </h3>



            <div className="summary-grid">


                <div className="summary-box">

                    <span>
                        Check In
                    </span>

                    <h4>
                        {
                            attendance.checkIn 
                            ||
                            "--:--"
                        }
                    </h4>

                </div>




                <div className="summary-box">

                    <span>
                        Check Out
                    </span>


                    <h4>
                        {
                            attendance.checkOut
                            ||
                            "--:--"
                        }
                    </h4>


                </div>





                <div className="summary-box">

                    <span>
                        Working Hours
                    </span>


                    <h4>
                        {
                            attendance.workingHours
                            ||
                            "00h 00m"
                        }
                    </h4>


                </div>





                <div className="summary-box">


                    <span>
                        Status
                    </span>


                    <h4

                        className={
                            attendance.status === "Present"
                            ?
                            "present"
                            :
                            "absent"
                        }

                    >

                        {
                            attendance.status
                            ||
                            "Absent"
                        }


                    </h4>


                </div>



            </div>


        </div>

    );

}