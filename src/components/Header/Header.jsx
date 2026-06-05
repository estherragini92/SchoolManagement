import { FaSearch, FaBell } from "react-icons/fa";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search......./" />
      </div>

      <div className="header-right">
        <FaBell className="notification-icon" />

        <div className="profile-box">
          <div className="profile-circle-header">S</div>
          <div>
            <h4>Sarah Johnson</h4>
            <p>Teacher</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;