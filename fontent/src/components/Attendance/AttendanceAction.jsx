import "./AttendanceAction.css";


export default function AttendanceAction({
    attendance,
    onCheckIn,
    onCheckOut
}) {


    return (

        <div className="attendance-action-card">


            <h3>
                Attendance Action
            </h3>



            <div className="attendance-time">


                <div className="time-box">

                    <span>
                        Check In
                    </span>


                    <strong>
                        {
                            attendance.checkIn 
                            || 
                            "--:--"
                        }
                    </strong>


                </div>




                <div className="time-box">

                    <span>
                        Check Out
                    </span>


                    <strong>
                        {
                            attendance.checkOut
                            ||
                            "--:--"
                        }
                    </strong>


                </div>


            </div>





            <div className="action-buttons">


                <button

                    className="checkin-button"

                    onClick={onCheckIn}

                    disabled={
                        Boolean(attendance.checkIn)
                    }

                >

                    Check In

                </button>





                <button

                    className="checkout-button"

                    onClick={onCheckOut}

                    disabled={
                        !attendance.checkIn ||
                        Boolean(attendance.checkOut)
                    }

                >

                    Check Out

                </button>


            </div>






            <div className="status-box">


                Status:


                <span

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
                    }

                </span>


            </div>


        </div>

    );

}