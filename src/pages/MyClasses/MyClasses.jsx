import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaUsers,
  FaClock,
  FaCalendarAlt,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEye,
  FaClipboardCheck,
  FaClipboardList,
} from "react-icons/fa";
import "./MyClasses.css";

const defaultClasses = [
  {
    id: 1,
    className: "Grade 6-A",
    subject: "Mathematics",
    room: "Room 201",
    students: 32,
    schedule: "Mon • Wed • Fri",
    time: "08:00 AM",
    status: "Active",
  },
  {
    id: 2,
    className: "Grade 7-B",
    subject: "Advanced Algebra",
    room: "Room 203",
    students: 28,
    schedule: "Tue • Thu",
    time: "10:00 AM",
    status: "Active",
  },
  {
    id: 3,
    className: "Grade 8-A",
    subject: "Statistics",
    room: "Room 205",
    students: 35,
    schedule: "Mon • Wed",
    time: "01:00 PM",
    status: "Active",
  },
  {
    id: 4,
    className: "Grade 6-B",
    subject: "Geometry",
    room: "Room 202",
    students: 33,
    schedule: "Fri",
    time: "03:00 PM",
    status: "Inactive",
  },
];

const emptyClass = {
  className: "",
  subject: "",
  room: "",
  students: "",
  schedule: "",
  time: "",
  status: "Active",
};

function MyClasses() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : defaultClasses;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [viewClass, setViewClass] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [classForm, setClassForm] = useState({ ...emptyClass });

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [classes]);

  const totalClasses = classes.length;
  const totalStudents = classes.reduce(
    (sum, item) => sum + Number(item.students || 0),
    0
  );
  const totalSubjects = new Set(classes.map((item) => item.subject)).size;
  const weeklySessions = classes.length * 6;

  const openAddModal = () => {
    setEditingId(null);
    setClassForm({ ...emptyClass });
    setShowModal(true);
  };

  const openEditModal = (classItem) => {
    setEditingId(classItem.id);
    setClassForm({
      className: classItem.className || "",
      subject: classItem.subject || "",
      room: classItem.room || "",
      students: classItem.students || "",
      schedule: classItem.schedule || "",
      time: classItem.time || "",
      status: classItem.status || "Active",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setClassForm({ ...emptyClass });
  };

  const saveClass = (e) => {
    e.preventDefault();

    const newClass = {
      id: editingId || Date.now(),
      ...classForm,
      students: Number(classForm.students),
    };

    if (editingId) {
      setClasses((prev) =>
        prev.map((item) => (item.id === editingId ? newClass : item))
      );
    } else {
      setClasses((prev) => [newClass, ...prev]);
    }

    const activities =
      JSON.parse(localStorage.getItem("dashboardActivities")) || [];

    localStorage.setItem(
      "dashboardActivities",
      JSON.stringify(
        [
          `${newClass.className} - ${newClass.subject} ${
            editingId ? "updated" : "created"
          }`,
          ...activities,
        ].slice(0, 10)
      )
    );

    window.dispatchEvent(new Event("dashboardUpdate"));
    closeModal();
  };

  const deleteClass = (id) => {
    if (!window.confirm("Delete this class?")) return;

    setClasses((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredClasses = classes.filter((item) => {
    const keyword = searchTerm.toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      item.className.toLowerCase().includes(keyword) ||
      item.subject.toLowerCase().includes(keyword) ||
      item.room.toLowerCase().includes(keyword);

    const matchesGrade =
      gradeFilter === "All Classes" || item.className.includes(gradeFilter);

    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div className="myclasses-page">
      <div className="page-title-row">
        <div>
          <h2>My Classes</h2>
          <p>Manage assigned classes, schedules and classroom actions</p>
        </div>

        <button type="button" className="add-btn" onClick={openAddModal}>
          <FaPlus />
          New Class
        </button>
      </div>

      <div className="myclasses-summary-grid">
        <div className="myclasses-summary-card">
          <div className="myclasses-summary-icon purple">
            <FaBookOpen />
          </div>
          <div>
            <p>Total Classes</p>
            <h3>{totalClasses}</h3>
          </div>
        </div>

        <div className="myclasses-summary-card">
          <div className="myclasses-summary-icon blue">
            <FaUsers />
          </div>
          <div>
            <p>Total Students</p>
            <h3>{totalStudents}</h3>
          </div>
        </div>

        <div className="myclasses-summary-card">
          <div className="myclasses-summary-icon green">
            <FaClipboardList />
          </div>
          <div>
            <p>Subjects</p>
            <h3>{totalSubjects}</h3>
          </div>
        </div>

        <div className="myclasses-summary-card">
          <div className="myclasses-summary-icon orange">
            <FaClock />
          </div>
          <div>
            <p>Weekly Sessions</p>
            <h3>{weeklySessions}</h3>
          </div>
        </div>
      </div>

      <div className="myclasses-filter-card">
        <div className="myclasses-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search class, subject or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option>All Classes</option>
          <option>Grade 6</option>
          <option>Grade 7</option>
          <option>Grade 8</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="class-card-grid">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <div className="teacher-class-card" key={item.id}>
                <div className="class-card-header">
                    <div>
                    <h3>{item.className}</h3>
                    <p>{item.subject}</p>
                    </div>

                    <span className="class-status active">{item.status}</span>
                </div>

                <div className="fixed-class-info">
                    <div className="fixed-info-row">
                    <FaUsers className="fixed-info-icon" />
                    <span>{item.students} Students</span>
                    </div>

                    <div className="fixed-info-row">
                    <FaBookOpen className="fixed-info-icon" />
                    <span>{item.room}</span>
                    </div>

                    <div className="fixed-info-row">
                    <FaCalendarAlt className="fixed-info-icon" />
                    <span>{item.schedule}</span>
                    </div>

                    <div className="fixed-info-row">
                    <FaClock className="fixed-info-icon" />
                    <span>{item.time || "08:00 AM"}</span>
                    </div>
                </div>

                <div className="class-actions-main">
                    <button type="button" onClick={() => navigate("/users")}>
                    <FaEye />
                    View Students
                    </button>

                    <button type="button" onClick={() => navigate("/attendance")}>
                    <FaClipboardCheck />
                    Take Attendance
                    </button>

                    <button type="button" onClick={() => navigate("/assignments")}>
                    <FaClipboardList />
                    Add Assignment
                    </button>
                </div>

                <div className="class-actions-small">
                    <button type="button" onClick={() => setViewClass(item)}>
                    <FaEye />
                    </button>

                    <button type="button" onClick={() => openEditModal(item)}>
                    <FaEdit />
                    </button>

                    <button type="button" onClick={() => deleteClass(item.id)}>
                    <FaTrash />
                    </button>
                </div>
                </div>
          ))
        ) : (
          <p>No classes found</p>
        )}
      </div>

      {showModal && (
        <div className="myclasses-modal-overlay">
          <div className="myclasses-modal">
            <div className="modal-header">
              <h3>{editingId ? "Edit Class" : "New Class"}</h3>

              <button type="button" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveClass}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Class Name</label>
                  <input
                    value={classForm.className}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        className: e.target.value,
                      })
                    }
                    placeholder="Grade 6-A"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    value={classForm.subject}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Mathematics"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Room</label>
                  <input
                    value={classForm.room}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        room: e.target.value,
                      })
                    }
                    placeholder="Room 201"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Students Count</label>
                  <input
                    type="number"
                    min="0"
                    value={classForm.students}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        students: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Schedule</label>
                  <input
                    value={classForm.schedule}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        schedule: e.target.value,
                      })
                    }
                    placeholder="Mon • Wed • Fri"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    value={classForm.time}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        time: e.target.value,
                      })
                    }
                    placeholder="08:00 AM"
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Status</label>
                  <select
                    value={classForm.status}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingId ? "Update Class" : "Save Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewClass && (
        <div className="myclasses-modal-overlay">
          <div className="myclasses-modal">
            <div className="modal-header">
              <h3>Class Details</h3>

              <button type="button" onClick={() => setViewClass(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="class-detail-box">
              <h2>{viewClass.className}</h2>
              <p>
                <strong>Subject:</strong> {viewClass.subject}
              </p>
              <p>
                <strong>Room:</strong> {viewClass.room}
              </p>
              <p>
                <strong>Students:</strong> {viewClass.students}
              </p>
              <p>
                <strong>Schedule:</strong> {viewClass.schedule}
              </p>
              <p>
                <strong>Time:</strong> {viewClass.time}
              </p>
              <p>
                <strong>Status:</strong> {viewClass.status}
              </p>

              <button
                type="button"
                className="save-btn"
                onClick={() => setViewClass(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyClasses;