import "./AttendanceAction.css";

export default function AttendanceStatus({ status }) {
  return (
    <div className="status-card">

      <h2 className="status-title">
        Attendance Status
      </h2>

      <div
        className={
          status === "Present"
            ? "status-badge present"
            : status === "Absent"
            ? "status-badge absent"
            : "status-badge pending"
        }
      >
        {status || "Not Marked"}
      </div>

      <p className="status-text">
        {status === "Present"
          ? "You have successfully marked today's attendance."
          : status === "Absent"
          ? "Attendance has not been marked today."
          : "Attendance status is not available."}
      </p>

    </div>
  );
}