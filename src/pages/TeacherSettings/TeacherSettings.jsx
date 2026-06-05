// src/pages/TeacherSettings/TeacherSettings.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaSave,
  FaSignOutAlt,
  FaMoon,
  FaEnvelope,
  FaLock,
  FaUserCircle,
} from "react-icons/fa";
import "./TeacherSettings.css";

function TeacherSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("teacherSettings")) || {
        fullName: "Ms. Sarah Johnson",
        email: "sarah.johnson@oakwood.edu",
        phone: "6390459849",
        subject: "Mathematics",
        department: "Science & Mathematics",
        bio: "Experienced mathematics teacher with 8 years of experience.",
        profileImage: "",

        notifications: {
          assignments: true,
          attendance: true,
          messages: true,
          approvals: false,
        },

        darkMode: false,
        emailNotifications: true,
        autoLogout: false,
      }
    );
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "teacherSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const toggleNotification = (type) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type],
      },
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setSettings({
        ...settings,
        profileImage: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const savePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    localStorage.setItem(
      "teacherPassword",
      JSON.stringify(passwordData)
    );

    alert("Password updated successfully");
  };

  const saveProfile = () => {
    localStorage.setItem(
      "teacherSettings",
      JSON.stringify(settings)
    );

    alert("Profile updated successfully");
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="teacher-settings-page">

      <div className="settings-header">
        <h1>Settings</h1>

        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Profile */}
      <div className="settings-card">
        <h2>
          <FaUserCircle />
          Profile
        </h2>

        <div className="profile-image">
          {settings.profileImage ? (
            <img src={settings.profileImage} alt="" />
          ) : (
            <div className="profile-placeholder">
              SJ
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
        </div>

        <div className="settings-grid">

          <input
            name="fullName"
            value={settings.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <input
            name="email"
            value={settings.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <input
            name="phone"
            value={settings.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />

          <input
            name="subject"
            value={settings.subject}
            onChange={handleChange}
            placeholder="Subject"
          />

          <input
            name="department"
            value={settings.department}
            onChange={handleChange}
            placeholder="Department"
          />

        </div>

        <textarea
          rows="4"
          name="bio"
          value={settings.bio}
          onChange={handleChange}
          placeholder="Bio"
        />

        <button
          className="save-btn"
          onClick={saveProfile}
        >
          <FaSave />
          Save Changes
        </button>
      </div>

      {/* Notifications */}
      <div className="settings-card">
        <h2>
          <FaBell />
          Notifications
        </h2>

        <label>
          Assignment Submissions
          <input
            type="checkbox"
            checked={settings.notifications.assignments}
            onChange={() =>
              toggleNotification("assignments")
            }
          />
        </label>

        <label>
          Attendance Alerts
          <input
            type="checkbox"
            checked={settings.notifications.attendance}
            onChange={() =>
              toggleNotification("attendance")
            }
          />
        </label>

        <label>
          New Messages
          <input
            type="checkbox"
            checked={settings.notifications.messages}
            onChange={() =>
              toggleNotification("messages")
            }
          />
        </label>

        <label>
          Grade Approvals
          <input
            type="checkbox"
            checked={settings.notifications.approvals}
            onChange={() =>
              toggleNotification("approvals")
            }
          />
        </label>
      </div>

      {/* Preferences */}
      <div className="settings-card">
        <h2>
          <FaMoon />
          Preferences
        </h2>

        <label>
          Dark Mode
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={() =>
              setSettings({
                ...settings,
                darkMode: !settings.darkMode,
              })
            }
          />
        </label>

        <label>
          Email Notifications
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={() =>
              setSettings({
                ...settings,
                emailNotifications:
                  !settings.emailNotifications,
              })
            }
          />
        </label>

        <label>
          Auto Logout
          <input
            type="checkbox"
            checked={settings.autoLogout}
            onChange={() =>
              setSettings({
                ...settings,
                autoLogout: !settings.autoLogout,
              })
            }
          />
        </label>
      </div>

      {/* Password */}
      <div className="settings-card">
        <h2>
          <FaLock />
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              currentPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
        />

        <button
          className="save-btn"
          onClick={savePassword}
        >
          Save Password
        </button>
      </div>

    </div>
  );
}

export default TeacherSettings;