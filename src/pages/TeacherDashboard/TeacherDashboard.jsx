import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaUsers,
  FaCalendarCheck,
  FaClipboardList,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import "./TeacherDashboard.css";

const defaultSchedule = [
  {
    id: 1,
    time: "08:00 AM",
    subject: "Mathematics",
    className: "Grade 6-A",
    room: "Room 201",
  },
  {
    id: 2,
    time: "10:00 AM",
    subject: "Advanced Algebra",
    className: "Grade 7-B",
    room: "Room 203",
  },
  {
    id: 3,
    time: "01:00 PM",
    subject: "Statistics",
    className: "Grade 8-A",
    room: "Room 205",
  },
  {
    id: 4,
    time: "03:00 PM",
    subject: "Geometry",
    className: "Grade 6-B",
    room: "Room 202",
  },
];

const attendanceChart = [
  { day: "Mon", present: 92 },
  { day: "Tue", present: 88 },
  { day: "Wed", present: 94 },
  { day: "Thu", present: 90 },
  { day: "Fri", present: 96 },
];

const performanceChart = [
  { subject: "Math", score: 86 },
  { subject: "Algebra", score: 82 },
  { subject: "Stats", score: 78 },
  { subject: "Geometry", score: 88 },
];

function TeacherDashboard() {
  const { currentUser } = useAuth();

  const [data, setData] = useState({
    students: [],
    classes: [],
    attendance: [],
    assignments: [],
    marks: [],
    notifications: [],
    activities: [],
  });
const [showNotifications, setShowNotifications] = useState(false);
  const loadData = () => {
    setData({
      students: JSON.parse(localStorage.getItem("students")) || [],
      classes: JSON.parse(localStorage.getItem("classes")) || [],
      attendance: JSON.parse(localStorage.getItem("studentAttendance")) || [],
      assignments: JSON.parse(localStorage.getItem("assignments")) || [],
      marks: JSON.parse(localStorage.getItem("marks")) || [],
      notifications:
  JSON.parse(localStorage.getItem("teacherNotifications")) || [],
      activities: JSON.parse(localStorage.getItem("dashboardActivities")) || [],
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

  const presentCount = data.attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const attendancePercent =
    data.attendance.length > 0
      ? Math.round((presentCount / data.attendance.length) * 100)
      : 92;

  const pendingTasks =
    data.assignments.filter((item) => item.status !== "Completed").length || 6;

  const averageMarks =
    data.marks.length > 0
      ? Math.round(
          data.marks.reduce((sum, item) => sum + Number(item.percentage || 0), 0) /
            data.marks.length
        )
      : 84;

  const recentActivities =
    data.activities.length > 0
      ? data.activities.slice(0, 5)
      : [
          "Attendance marked for Grade 6-A",
          "Algebra Practice Worksheet created",
          "Priya Sharma scored 94% in Science",
          "Parent message received",
        ];

  const notifications =
    data.notifications.length > 0
      ? data.notifications.slice(0, 4)
      : [
          { id: 1, text: "Parent conference scheduled today" },
          { id: 2, text: "Exam marks approval pending" },
          { id: 3, text: "Attendance below threshold in Grade 7-B" },
        ];

  return (
    <div className="teacher-dashboard-page">
      <div className="teacher-dashboard-header">
        <div>
          <h2>Welcome back, {currentUser?.name || "Sarah Johnson"}</h2>
          <p>Here is your teaching overview for today</p>
        </div>

        <div
  className="teacher-header-badge"
  onClick={() => setShowNotifications(!showNotifications)}
>
  <FaBell />
  <span>{notifications.length}</span>

  {showNotifications && (
  <div className="teacher-notification-dropdown">
    {notifications.map((item) => (
      <div className="teacher-dropdown-item" key={item.id}>
        <strong>{item.title || item.text}</strong>
        <p>{item.message || ""}</p>
      </div>
    ))}
  </div>
)}
</div>
      </div>

      <div className="teacher-stats-grid">
        <div className="teacher-stat-card purple">
          <div className="teacher-stat-icon">
            <FaBookOpen />
          </div>
          <div>
            <p>Total Classes</p>
            <h3>{data.classes.length || 4}</h3>
          </div>
        </div>

        <div className="teacher-stat-card blue">
          <div className="teacher-stat-icon">
            <FaUsers />
          </div>
          <div>
            <p>Total Students</p>
            <h3>{data.students.length || 128}</h3>
          </div>
        </div>

        <div className="teacher-stat-card green">
          <div className="teacher-stat-icon">
            <FaCalendarCheck />
          </div>
          <div>
            <p>Avg Attendance</p>
            <h3>{attendancePercent}%</h3>
          </div>
        </div>

        <div className="teacher-stat-card orange">
          <div className="teacher-stat-icon">
            <FaClipboardList />
          </div>
          <div>
            <p>Pending Tasks</p>
            <h3>{pendingTasks}</h3>
          </div>
        </div>
      </div>

      <div className="teacher-dashboard-grid">
        <div className="teacher-card large">
          <div className="teacher-card-header">
            <div>
              <h3>Attendance Overview</h3>
              <p>Weekly attendance trend</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={attendanceChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#5b3df5"
                strokeWidth={4}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="teacher-card">
          <h3>Student Performance</h3>
          <p>Average score: {averageMarks}%</p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={performanceChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#5b3df5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="teacher-card">
          <h3>Today's Schedule</h3>
          <p>Your classes for today</p>

          <div className="schedule-list">
            {defaultSchedule.map((item) => (
              <div className="schedule-item" key={item.id}>
                <div className="schedule-time">{item.time}</div>
                <div>
                  <h4>{item.subject}</h4>
                  <p>
                    {item.className} · {item.room}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="teacher-card">
          <h3>Recent Activity</h3>
          <p>Latest updates</p>

          <div className="teacher-activity-list">
            {recentActivities.map((item, index) => (
              <div className="teacher-activity-item" key={index}>
                <FaCheckCircle />
                <p>{typeof item === "string" ? item : item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="teacher-card">
          <h3>Notifications</h3>
          <p>Important reminders</p>

          <div className="teacher-notification-list">
            {notifications.map((item) => (
              <div className="teacher-notification-item" key={item.id}>
                <FaExclamationTriangle />
                <p>
                <strong>{item.title || item.text}</strong>
                <br />
                {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="teacher-card">
          <h3>Quick Insights</h3>
          <p>Classroom analytics</p>

          <div className="teacher-insight">
            <FaChartLine />
            <div>
              <h4>{averageMarks}%</h4>
              <p>Average class performance</p>
            </div>
          </div>

          <div className="teacher-insight">
            <FaCalendarCheck />
            <div>
              <h4>{attendancePercent}%</h4>
              <p>Average attendance rate</p>
            </div>
          </div>

          <div className="teacher-insight">
            <FaClipboardList />
            <div>
              <h4>{pendingTasks}</h4>
              <p>Tasks need your action</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;