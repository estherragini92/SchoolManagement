import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import "./ParentAttendance.css";

function ParentAttendance() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const loadData = () => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const records = JSON.parse(localStorage.getItem("studentAttendance")) || [];

    setStudent(students[0] || null);
    setAttendance(records);
  };

  useEffect(() => {
    loadData();

    window.addEventListener("dashboardUpdate", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("dashboardUpdate", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const childRecords = attendance.filter(
    (item) => item.name === student?.name
  );

  const present = childRecords.filter((item) => item.status === "Present").length;
  const absent = childRecords.filter((item) => item.status === "Absent").length;
  const late = childRecords.filter((item) => item.status === "Late").length;

  const percentage =
    childRecords.length > 0
      ? Math.round((present / childRecords.length) * 100)
      : student?.attendance || 0;

  return (
    <div className="parent-attendance-page">
      <div className="page-title-row">
        <div>
          <h2>Attendance</h2>
          <p>View your child attendance details</p>
        </div>
      </div>

      <div className="attendance-stats-grid">
        <div className="attendance-stat-card">
          <FaCalendarCheck />
          <div>
            <p>Attendance Rate</p>
            <h3>{percentage}%</h3>
          </div>
        </div>

        <div className="attendance-stat-card">
          <FaCheckCircle />
          <div>
            <p>Present</p>
            <h3>{present}</h3>
          </div>
        </div>

        <div className="attendance-stat-card">
          <FaTimesCircle />
          <div>
            <p>Absent</p>
            <h3>{absent}</h3>
          </div>
        </div>

        <div className="attendance-stat-card">
          <FaClock />
          <div>
            <p>Late</p>
            <h3>{late}</h3>
          </div>
        </div>
      </div>

      <div className="attendance-table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {childRecords.length > 0 ? (
              childRecords.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.className}</td>
                  <td>{item.date || "Today"}</td>
                  <td>
                    <span className={`attendance-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 25 }}>
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParentAttendance;