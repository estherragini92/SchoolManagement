import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaUsers,
  FaCalendarCheck,
  FaClipboardList,
  FaGraduationCap,
  FaComments,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./TeacherSidebar.css";

function TeacherSidebar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const teacherMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "My Classes", path: "/my-classes", icon: <FaBook /> },
    { name: "Students", path: "/teacher-students", icon: <FaUsers /> },
    { name: "Attendance", path: "/teacher-attendance", icon: <FaCalendarCheck /> },
    { name: "Assignment", path: "/assignments", icon: <FaClipboardList /> },
    { name: "Exams & Marks", path: "/marks", icon: <FaGraduationCap /> },
    { name: "Messages", path: "/teacher-messages", icon: <FaComments /> },
    { name: "Settings", path: "/teacher-settings", icon: <FaCog /> },
    
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="teacher-sidebar">
      <div className="teacher-logo-box">
        <div className="teacher-logo-icon">🎓</div>
        <div>
          <h2>EduSmart</h2>
          <p>Teacher Portal</p>
        </div>
      </div>

      <nav className="teacher-sidebar-menu">
        {teacherMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "teacher-menu-link active" : "teacher-menu-link"
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="teacher-profile-card">
        <div className="teacher-avatar">
          {currentUser?.avatar || currentUser?.name?.charAt(0) || "T"}
        </div>

        <div>
          <h4>{currentUser?.name || "Sarah Johnson"}</h4>
          <p>{currentUser?.subject || "Mathematics"} Teacher</p>
        </div>
      </div>

      <button className="teacher-logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default TeacherSidebar;