import { useEffect, useState } from "react";
import {
  FaSchool,
  FaUserShield,
  FaCalendarAlt,
  FaCreditCard,
  FaPlus,
  FaSave,
  FaUpload,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import "./Settings.css";

const defaultProfile = {
  schoolName: "EduSmart International School",
  email: "admin@edusmart.com",
  phone: "+91 98765 43210",
  website: "www.edusmartschool.com",
  board: "CBSE",
  establishedYear: "2010",
  address: "123 Main Road, Salem, Tamil Nadu, India",
  logo: "",
};

const defaultYears = [
  {
    id: 1,
    year: "2025 - 2026",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    status: "Current",
  },
];

const defaultRoles = [
  {
    id: 1,
    role: "Admin",
    permissions: ["Dashboard", "Students", "Fees", "Reports", "Settings"],
  },
  {
    id: 2,
    role: "Teacher",
    permissions: ["Dashboard", "Attendance", "Academic", "Reports"],
  },
  {
    id: 3,
    role: "Staff",
    permissions: ["Students", "Fees", "Documents"],
  },
  {
    id: 4,
    role: "Parent",
    permissions: ["Student Profile", "Fees", "Announcements"],
  },
];

const emptyYear = {
  year: "",
  startDate: "",
  endDate: "",
  status: "Past",
};

const emptyRole = {
  role: "",
  permissions: "",
};

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("schoolProfile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [academicYears, setAcademicYears] = useState(() => {
    const saved = localStorage.getItem("academicYears");
    return saved ? JSON.parse(saved) : defaultYears;
  });

  const [roles, setRoles] = useState(() => {
    const saved = localStorage.getItem("roles");
    return saved ? JSON.parse(saved) : defaultRoles;
  });

  const [integrations, setIntegrations] = useState(() => {
    const saved = localStorage.getItem("integrations");
    return saved
      ? JSON.parse(saved)
      : {
          stripeEnabled: true,
          stripePublishableKey: "",
          stripeSecretKey: "",
          razorpayEnabled: true,
          razorpayKeyId: "",
          razorpayKeySecret: "",
        };
  });

  const [showYearModal, setShowYearModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingYearId, setEditingYearId] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);

  const [yearForm, setYearForm] = useState(emptyYear);
  const [roleForm, setRoleForm] = useState(emptyRole);

  useEffect(() => {
    localStorage.setItem("schoolProfile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("academicYears", JSON.stringify(academicYears));
  }, [academicYears]);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem("integrations", JSON.stringify(integrations));
  }, [integrations]);

  const saveSettings = () => {
    localStorage.setItem("schoolProfile", JSON.stringify(profile));
    localStorage.setItem("academicYears", JSON.stringify(academicYears));
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("integrations", JSON.stringify(integrations));
    alert("Settings saved successfully");
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        logo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const openAddYear = () => {
    setEditingYearId(null);
    setYearForm(emptyYear);
    setShowYearModal(true);
  };

  const openEditYear = (year) => {
    setEditingYearId(year.id);
    setYearForm({
      year: year.year,
      startDate: year.startDate,
      endDate: year.endDate,
      status: year.status,
    });
    setShowYearModal(true);
  };

  const saveYear = (e) => {
    e.preventDefault();

    const newYear = {
      id: editingYearId || Date.now(),
      ...yearForm,
    };

    if (yearForm.status === "Current") {
      setAcademicYears((prev) =>
        prev.map((item) => ({ ...item, status: "Past" }))
      );
    }

    if (editingYearId) {
      setAcademicYears((prev) =>
        prev.map((item) =>
          item.id === editingYearId ? newYear : item
        )
      );
    } else {
      setAcademicYears((prev) => [newYear, ...prev]);
    }

    setShowYearModal(false);
    setEditingYearId(null);
    setYearForm(emptyYear);
  };

  const deleteYear = (id) => {
    if (!window.confirm("Delete this academic year?")) return;
    setAcademicYears((prev) => prev.filter((item) => item.id !== id));
  };

  const openAddRole = () => {
    setEditingRoleId(null);
    setRoleForm(emptyRole);
    setShowRoleModal(true);
  };

  const openEditRole = (role) => {
    setEditingRoleId(role.id);
    setRoleForm({
      role: role.role,
      permissions: role.permissions.join(", "),
    });
    setShowRoleModal(true);
  };

  const saveRole = (e) => {
    e.preventDefault();

    const newRole = {
      id: editingRoleId || Date.now(),
      role: roleForm.role,
      permissions: roleForm.permissions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (editingRoleId) {
      setRoles((prev) =>
        prev.map((item) =>
          item.id === editingRoleId ? newRole : item
        )
      );
    } else {
      setRoles((prev) => [newRole, ...prev]);
    }

    setShowRoleModal(false);
    setEditingRoleId(null);
    setRoleForm(emptyRole);
  };

  const deleteRole = (id) => {
    if (!window.confirm("Delete this role?")) return;
    setRoles((prev) => prev.filter((item) => item.id !== id));
  };

  const testPaymentGateway = (gateway) => {
    alert(`${gateway} test connection successful in frontend simulation.`);
  };

  return (
    <div className="settings-page">
      <div className="page-title-row">
        <div>
          <h2>Settings</h2>
          <p>Manage school profile, roles, academic year and integrations</p>
        </div>

        <button className="save-settings-btn" onClick={saveSettings}>
          <FaSave />
          Save Changes
        </button>
      </div>

      <div className="settings-tabs">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          <FaSchool />
          School Profile
        </button>

        <button
          className={activeTab === "roles" ? "active" : ""}
          onClick={() => setActiveTab("roles")}
        >
          <FaUserShield />
          Roles & Permissions
        </button>

        <button
          className={activeTab === "year" ? "active" : ""}
          onClick={() => setActiveTab("year")}
        >
          <FaCalendarAlt />
          Academic Year
        </button>

        <button
          className={activeTab === "integration" ? "active" : ""}
          onClick={() => setActiveTab("integration")}
        >
          <FaCreditCard />
          Integration
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="settings-card">
          <h3>School Profile</h3>

          <div className="school-logo-section">
            {profile.logo ? (
              <img src={profile.logo} alt="School Logo" className="school-logo-img" />
            ) : (
              <div className="school-logo">
                <FaSchool />
              </div>
            )}

            <label className="upload-logo-btn">
              <FaUpload />
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
            </label>
          </div>

          <div className="settings-form-grid">
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                value={profile.schoolName}
                onChange={(e) =>
                  setProfile({ ...profile, schoolName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Board</label>
              <select
                value={profile.board}
                onChange={(e) =>
                  setProfile({ ...profile, board: e.target.value })
                }
              >
                <option>CBSE</option>
                <option>State Board</option>
                <option>ICSE</option>
                <option>Matriculation</option>
              </select>
            </div>

            <div className="form-group">
              <label>Established Year</label>
              <input
                type="text"
                value={profile.establishedYear}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    establishedYear: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group full">
              <label>Address</label>
              <textarea
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {activeTab === "roles" && (
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>Roles & Permissions</h3>

            <button className="add-year-btn" onClick={openAddRole}>
              <FaPlus />
              Add Role
            </button>
          </div>

          <div className="roles-grid">
            {roles.map((item) => (
              <div className="role-card" key={item.id}>
                <div className="role-header">
                  <h4>{item.role}</h4>
                  <div className="table-actions">
                    <button onClick={() => openEditRole(item)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => deleteRole(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="permission-list">
                  {item.permissions.map((permission, index) => (
                    <span key={index}>
                      <FaCheckCircle />
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "year" && (
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>Academic Year</h3>

            <button className="add-year-btn" onClick={openAddYear}>
              <FaPlus />
              Add Year
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Academic Year</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {academicYears.map((year) => (
                <tr key={year.id}>
                  <td>{year.year}</td>
                  <td>{year.startDate}</td>
                  <td>{year.endDate}</td>
                  <td>
                    <span
                      className={
                        year.status === "Current"
                          ? "year-status current"
                          : "year-status past"
                      }
                    >
                      {year.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEditYear(year)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteYear(year.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "integration" && (
        <div className="integration-grid">
          <div className="integration-card">
            <h3>Stripe Payment</h3>
            <p>Accept international card payments using Stripe.</p>

            <div className="toggle-row">
              <span>Status</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={integrations.stripeEnabled}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      stripeEnabled: e.target.checked,
                    })
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="form-group">
              <label>Publishable Key</label>
              <input
                type="text"
                value={integrations.stripePublishableKey}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    stripePublishableKey: e.target.value,
                  })
                }
                placeholder="pk_test_xxxxxxxxx"
              />
            </div>

            <div className="form-group">
              <label>Secret Key</label>
              <input
                type="password"
                value={integrations.stripeSecretKey}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    stripeSecretKey: e.target.value,
                  })
                }
                placeholder="sk_test_xxxxxxxxx"
              />
            </div>

            <button
              className="save-btn"
              type="button"
              onClick={() => testPaymentGateway("Stripe")}
            >
              Test Stripe
            </button>
          </div>

          <div className="integration-card">
            <h3>Razorpay Payment</h3>
            <p>Accept UPI, card and net banking payments using Razorpay.</p>

            <div className="toggle-row">
              <span>Status</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={integrations.razorpayEnabled}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      razorpayEnabled: e.target.checked,
                    })
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="form-group">
              <label>Key ID</label>
              <input
                type="text"
                value={integrations.razorpayKeyId}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    razorpayKeyId: e.target.value,
                  })
                }
                placeholder="rzp_test_xxxxxxxxx"
              />
            </div>

            <div className="form-group">
              <label>Key Secret</label>
              <input
                type="password"
                value={integrations.razorpayKeySecret}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    razorpayKeySecret: e.target.value,
                  })
                }
                placeholder="Enter key secret"
              />
            </div>

            <button
              className="save-btn"
              type="button"
              onClick={() => testPaymentGateway("Razorpay")}
            >
              Test Razorpay
            </button>
          </div>
        </div>
      )}

      {showYearModal && (
        <div className="modal-overlay">
          <div className="year-modal">
            <div className="modal-header">
              <h3>{editingYearId ? "Edit" : "Add"} Academic Year</h3>
              <button onClick={() => setShowYearModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveYear}>
              <div className="form-group">
                <label>Academic Year</label>
                <input
                  type="text"
                  placeholder="2026 - 2027"
                  value={yearForm.year}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, year: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={yearForm.startDate}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={yearForm.endDate}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, endDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={yearForm.status}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, status: e.target.value })
                  }
                >
                  <option>Current</option>
                  <option>Past</option>
                  <option>Upcoming</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowYearModal(false)}
                >
                  Cancel
                </button>

                <button className="save-btn" type="submit">
                  {editingYearId ? "Update Year" : "Save Year"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleModal && (
        <div className="modal-overlay">
          <div className="year-modal">
            <div className="modal-header">
              <h3>{editingRoleId ? "Edit" : "Add"} Role</h3>
              <button onClick={() => setShowRoleModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveRole}>
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  value={roleForm.role}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, role: e.target.value })
                  }
                  placeholder="Accountant"
                  required
                />
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <textarea
                  value={roleForm.permissions}
                  onChange={(e) =>
                    setRoleForm({
                      ...roleForm,
                      permissions: e.target.value,
                    })
                  }
                  placeholder="Dashboard, Fees, Reports"
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </button>

                <button className="save-btn" type="submit">
                  {editingRoleId ? "Update Role" : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;