let attendance = {
  checkIn: null,
  checkOut: null,
  status: "Absent",
  workingHours: "--",
};

export function getAttendance() {
  return { ...attendance };
}

export function checkIn() {
  attendance.checkIn = new Date().toLocaleTimeString();
  attendance.status = "Present";

  return { ...attendance };
}

export function checkOut() {
  attendance.checkOut = new Date().toLocaleTimeString();

  const inTime = new Date(
    "2000-01-01 " + attendance.checkIn
  );

  const outTime = new Date(
    "2000-01-01 " + attendance.checkOut
  );

  const diff =
    (outTime - inTime) / 1000;

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  attendance.workingHours =
    `${hours}h ${minutes}m`;

  return { ...attendance };
}