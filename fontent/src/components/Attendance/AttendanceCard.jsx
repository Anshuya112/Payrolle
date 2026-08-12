import "./AttendanceAction.css";

export default function AttendanceCard({ attendance }) {
  if (!attendance) return null;

  return (
    <div className="attendance-card">

      <h2 className="card-title">
        Today's Attendance
      </h2>

      <div className="attendance-grid">

        <div className="attendance-box checkin">
          <h4>Check In</h4>
          <p>{attendance.checkIn || "--:--"}</p>
        </div>

        <div className="attendance-box checkout">
          <h4>Check Out</h4>
          <p>{attendance.checkOut || "--:--"}</p>
        </div>

        <div className="attendance-box hours">
          <h4>Working Hours</h4>
          <p>{attendance.workingHours || "00h 00m"}</p>
        </div>

        <div className="attendance-box status">
          <h4>Status</h4>
          <span
            className={
              attendance.status === "Present"
                ? "present"
                : "absent"
            }
          >
            {attendance.status || "Absent"}
          </span>
        </div>

      </div>

    </div>
  );
}