import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaComments,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaCheckCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";
import TeacherSidebar from "../TeacherSidebar/TeacherSidebar";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "User Management", path: "/users", icon: <FaUsers /> },
    { name: "Academic", path: "/academic", icon: <FaBook /> },
    { name: "Attendance", path: "/attendance", icon: <FaCalendarCheck /> },
    { name: "Fees", path: "/fees", icon: <FaMoneyBillWave /> },
    { name: "Communication", path: "/communication", icon: <FaComments /> },
    { name: "Reports", path: "/reports", icon: <FaChartBar /> },
    { name: "Documents", path: "/documents", icon: <FaFileAlt /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
    { name: "Approvals", path: "/approvals", icon: <FaCheckCircle /> },
  ];
const { currentUser } = useAuth();

if (currentUser?.role === "teacher") {
  return <TeacherSidebar />;
}
  return (
    <aside className="sidebar">
      <div className="logo-box">
        <div className="logo-icon">🎓</div>
        <h2>EduSmart</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="profile-circle">A</div>
        <div>
          <h4>Admin User</h4>
          <p>Administrator</p>
        </div>
      </div>

    <button
  className="logout-btn"
  onClick={() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }}
>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;