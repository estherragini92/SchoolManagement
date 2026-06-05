import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import "./ParentDashboard.css";

function ParentDashboard() {
  const [data, setData] = useState({
    students: [],
    attendance: [],
    marks: [],
    assignments: [],
    fees: [],
    notifications: [],
  });

  const loadData = () => {
    setData({
      students: JSON.parse(localStorage.getItem("students")) || [],
      attendance: JSON.parse(localStorage.getItem("studentAttendance")) || [],
      marks: JSON.parse(localStorage.getItem("marks")) || [],
      assignments: JSON.parse(localStorage.getItem("assignments")) || [],
      fees: JSON.parse(localStorage.getItem("feePayments")) || [],
      notifications:
        JSON.parse(localStorage.getItem("teacherNotifications")) || [],
    });
  };

  useEffect(() => {
    loadData();

    window.addEventListener("dashboardUpdate", loadData);
    window.addEventListener("teacherNotificationUpdate", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("dashboardUpdate", loadData);
      window.removeEventListener("teacherNotificationUpdate", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const child = data.students[0];

  const childAttendance = data.attendance.filter(
    (item) => item.name === child?.name
  );

  const presentCount = childAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const attendancePercent =
    childAttendance.length > 0
      ? Math.round((presentCount / childAttendance.length) * 100)
      : child?.attendance || 0;

  const childMarks = data.marks.filter(
    (item) => item.studentName === child?.name
  );

  const averageMarks =
    childMarks.length > 0
      ? Math.round(
          childMarks.reduce(
            (sum, item) => sum + Number(item.percentage || 0),
            0
          ) / childMarks.length
        )
      : child?.performance || 0;

  const pendingAssignments = data.assignments.filter(
    (item) => item.status !== "Completed"
  ).length;

  const totalPaid = data.fees.reduce(
    (sum, item) => sum + Number(item.amount || item.paidAmount || 0),
    0
  );

  return (
    <div className="parent-dashboard-page">
      <div className="parent-dashboard-header">
        <div>
          <h2>Parent Dashboard</h2>
          <p>Track your child&apos;s academic progress and updates</p>
        </div>
      </div>

      <div className="parent-child-card">
        <div className="parent-child-avatar">
          {child?.photo ? (
            <img src={child.photo} alt={child.name} />
          ) : (
            <FaUserGraduate />
          )}
        </div>

        <div>
          <h3>{child?.name || "No child added"}</h3>
          <p>
            {child
              ? `${child.className || "Grade"}-${child.section || ""} · Roll No: ${
                  child.rollNo || "N/A"
                }`
              : "Add student details from Admin User Management"}
          </p>
          <p>Parent: {child?.parent || "Not added"}</p>
        </div>
      </div>

      <div className="parent-stats-grid">
        <div className="parent-stat-card">
          <FaCalendarCheck />
          <div>
            <p>Attendance</p>
            <h3>{attendancePercent}%</h3>
          </div>
        </div>

        <div className="parent-stat-card">
          <FaChartLine />
          <div>
            <p>Average Marks</p>
            <h3>{averageMarks}%</h3>
          </div>
        </div>

        <div className="parent-stat-card">
          <FaClipboardList />
          <div>
            <p>Pending Assignments</p>
            <h3>{pendingAssignments}</h3>
          </div>
        </div>

        <div className="parent-stat-card">
          <FaMoneyBillWave />
          <div>
            <p>Total Paid Fees</p>
            <h3>₹{totalPaid}</h3>
          </div>
        </div>
      </div>

      <div className="parent-dashboard-grid">
        <div className="parent-card">
          <h3>Recent Marks</h3>

          {childMarks.length > 0 ? (
            childMarks.slice(0, 5).map((mark) => (
              <div className="parent-list-item" key={mark.id}>
                <div>
                  <h4>{mark.subject}</h4>
                  <p>{mark.examType}</p>
                </div>
                <strong>{mark.percentage}%</strong>
              </div>
            ))
          ) : (
            <p>No marks added yet</p>
          )}
        </div>

        <div className="parent-card">
          <h3>Assignments</h3>

          {data.assignments.length > 0 ? (
            data.assignments.slice(0, 5).map((item) => (
              <div className="parent-list-item" key={item.id}>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.className} · Due: {item.dueDate}</p>
                </div>
                <span>{item.status}</span>
              </div>
            ))
          ) : (
            <p>No assignments yet</p>
          )}
        </div>

        <div className="parent-card">
          <h3>Notifications</h3>

          {data.notifications.length > 0 ? (
            data.notifications.slice(0, 5).map((note) => (
              <div className="parent-notification" key={note.id}>
                <FaBell />
                <div>
                  <h4>{note.title || note.text}</h4>
                  <p>{note.message || ""}</p>
                  <small>{note.date || note.time}</small>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;