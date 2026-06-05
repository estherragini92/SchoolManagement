import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUpload,
} from "react-icons/fa";
import "./Assignments.css";

const defaultAssignments = [
  {
    id: 1,
    title: "Quadratic Equations Practice set",
    className: "Grade 10-A",
    dueDate: "2026-04-15",
    submitted: 28,
    total: 30,
    status: "Active",
    files: 2,
  },
  {
    id: 2,
    title: "Algebraic Expressions",
    className: "Grade 10-C",
    dueDate: "2026-04-13",
    submitted: 30,
    total: 30,
    status: "Needs Grading",
    files: 1,
  },
  {
    id: 3,
    title: "Statistics chapter 4 problems",
    className: "Grade 10-D",
    dueDate: "2026-04-18",
    submitted: 25,
    total: 25,
    status: "Completed",
    files: 3,
  },
];

const emptyAssignment = {
  title: "",
  className: "",
  dueDate: "",
  submitted: "",
  total: "",
  status: "Active",
  files: 0,
};

function Assignments() {
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : defaultAssignments;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [form, setForm] = useState(emptyAssignment);

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [assignments]);

  const activeCount = assignments.filter((a) => a.status === "Active").length;
  const gradingCount = assignments.filter(
    (a) => a.status === "Needs Grading"
  ).length;
  const completedCount = assignments.filter(
    (a) => a.status === "Completed"
  ).length;

  const getPercent = (item) => {
    if (!item.total) return 0;
    return Math.round((Number(item.submitted) / Number(item.total)) * 100);
  };

  const filteredAssignments = assignments.filter((item) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(keyword) ||
      item.className.toLowerCase().includes(keyword);

    const matchesClass =
      classFilter === "All Classes" || item.className.includes(classFilter);

    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyAssignment);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
    setShowModal(true);
  };

  const saveAssignment = (e) => {
    e.preventDefault();

    const newAssignment = {
      ...form,
      id: editingId || Date.now(),
      submitted: Number(form.submitted),
      total: Number(form.total),
      files: Number(form.files),
    };

    if (editingId) {
      setAssignments((prev) =>
        prev.map((item) => (item.id === editingId ? newAssignment : item))
      );
    } else {
      setAssignments((prev) => [newAssignment, ...prev]);
    }

    const activities =
      JSON.parse(localStorage.getItem("dashboardActivities")) || [];

    localStorage.setItem(
      "dashboardActivities",
      JSON.stringify([
        `${newAssignment.title} assignment ${
          editingId ? "updated" : "created"
        }`,
        ...activities,
      ])
    );

    setShowModal(false);
    setForm(emptyAssignment);
    setEditingId(null);
  };

  const deleteAssignment = (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    setAssignments((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStatus = (id, status) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="assignments-page">
      <div className="assignment-header">
        <div>
          <h2>Assignments</h2>
        </div>

        <button className="create-assignment-btn" onClick={openAdd}>
          <FaPlus />
          Create Assignment
        </button>
      </div>

      <div className="assignment-stats">
        <div className="assignment-stat-card">
          <div className="stat-icon purple">
            <FaClipboardList />
          </div>
          <div>
            <h3>{activeCount + gradingCount + completedCount}</h3>
            <p>Active Assignments</p>
          </div>
        </div>

        <div className="assignment-stat-card">
          <div className="stat-icon yellow">
            <FaClipboardList />
          </div>
          <div>
            <h3>{gradingCount}</h3>
            <p>Needs Grading</p>
          </div>
        </div>

        <div className="assignment-stat-card">
          <div className="stat-icon green">
            <FaCheckCircle />
          </div>
          <div>
            <h3>{completedCount}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="assignment-filter-box">
        <div className="assignment-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option>All Classes</option>
          <option>Grade 1</option>
          <option>Grade 2</option>
          <option>Grade 3</option>
          <option>Grade 4</option>
          <option>Grade 5</option>
          <option>Grade 6</option>
          <option>Grade 7</option>
          <option>Grade 8</option>
          <option>Grade 9</option>
          <option>Grade 10</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Needs Grading</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="assignment-table-wrapper">
        <table className="assignment-table">
          <thead>
            <tr>
              <th>Assignment Title</th>
              <th>Class</th>
              <th>Due Date</th>
              <th>Submissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map((item) => (
              <tr key={item.id}>
                <td>
                  <h4>{item.title}</h4>
                  <p>📎 {item.files} Files attached</p>
                </td>

                <td>
                  <span className="class-pill">
                    {item.className.replace("Grade ", "")}
                  </span>
                </td>

                <td className={item.dueDate < "2026-04-15" ? "danger-date" : ""}>
                  <FaCalendarAlt />
                  {item.dueDate}
                </td>

                <td>
                  <strong>
                    {item.submitted} / {item.total}
                  </strong>
                  <p>Submitted</p>

                  <div className="submission-line">
                    <div style={{ width: `${getPercent(item)}%` }}></div>
                  </div>

                  <span>{getPercent(item)}%</span>
                </td>

                <td>
                  <select
                    className={`status-select ${item.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                  >
                    <option>Active</option>
                    <option>Needs Grading</option>
                    <option>Completed</option>
                  </select>
                </td>

                <td>
                  <div className="assignment-actions">
                    <button onClick={() => setViewAssignment(item)}>
                      <FaEye />
                    </button>

                    <button onClick={() => openEdit(item)}>
                      <FaEdit />
                    </button>

                    <button onClick={() => deleteAssignment(item.id)}>
                      <FaTrash />
                    </button>

                    <button>
                      <FaUpload />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="assignment-modal-overlay">
          <div className="assignment-modal">
            <div className="modal-header">
              <h3>{editingId ? "Edit Assignment" : "Create Assignment"}</h3>

              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveAssignment}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Assignment Title</label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Class</label>
                  <select
                    value={form.className}
                    onChange={(e) =>
                      setForm({ ...form, className: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Class</option>
                    <option>Grade 1-A</option>
                    <option>Grade 1-B</option>
                    <option>Grade 2-A</option>
                    <option>Grade 3-A</option>
                    <option>Grade 4-A</option>
                    <option>Grade 5-A</option>
                    <option>Grade 6-A</option>
                    <option>Grade 7-B</option>
                    <option>Grade 8-A</option>
                    <option>Grade 9-A</option>
                    <option>Grade 10-A</option>
                    <option>Grade 10-B</option>
                    <option>Grade 10-C</option>
                    <option>Grade 10-D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Submitted Count</label>
                  <input
                    type="number"
                    value={form.submitted}
                    onChange={(e) =>
                      setForm({ ...form, submitted: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Students</label>
                  <input
                    type="number"
                    value={form.total}
                    onChange={(e) =>
                      setForm({ ...form, total: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Attached Files Count</label>
                  <input
                    type="number"
                    value={form.files}
                    onChange={(e) =>
                      setForm({ ...form, files: e.target.value })
                    }
                  />
                </div>

                <div className="form-group full">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option>Active</option>
                    <option>Needs Grading</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingId ? "Update Assignment" : "Save Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewAssignment && (
        <div className="assignment-modal-overlay">
          <div className="assignment-modal">
            <div className="modal-header">
              <h3>Assignment Details</h3>

              <button onClick={() => setViewAssignment(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="assignment-detail-box">
              <h2>{viewAssignment.title}</h2>
              <p>
                <strong>Class:</strong> {viewAssignment.className}
              </p>
              <p>
                <strong>Due Date:</strong> {viewAssignment.dueDate}
              </p>
              <p>
                <strong>Status:</strong> {viewAssignment.status}
              </p>
              <p>
                <strong>Submissions:</strong> {viewAssignment.submitted}/
                {viewAssignment.total}
              </p>
              <p>
                <strong>Files:</strong> {viewAssignment.files}
              </p>

              <button
                className="save-btn"
                onClick={() => setViewAssignment(null)}
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

export default Assignments;