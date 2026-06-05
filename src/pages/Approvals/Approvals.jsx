import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import "./Approvals.css";

const defaultRequests = [
  {
    id: 1,
    title: "Leave Request",
    requestedBy: "Mrs. Lakshmi",
    role: "Teacher",
    type: "Leave",
    date: "2026-05-20",
    reason: "Medical appointment",
    status: "Pending",
    note: "",
  },
  {
    id: 2,
    title: "Admission Request",
    requestedBy: "Rahul Kumar",
    role: "Student",
    type: "Admission",
    date: "2026-05-21",
    reason: "New admission for Grade 8",
    status: "Pending",
    note: "",
  },
  {
    id: 3,
    title: "Attendance Correction",
    requestedBy: "Priya Sharma",
    role: "Student",
    type: "Attendance",
    date: "2026-05-22",
    reason: "Marked absent by mistake",
    status: "Approved",
    note: "Verified and approved",
  },
];

const emptyRequest = {
  title: "",
  requestedBy: "",
  role: "Student",
  type: "Leave",
  date: new Date().toISOString().split("T")[0],
  reason: "",
  status: "Pending",
  note: "",
};

function Approvals() {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("approvalRequests");
    return saved ? JSON.parse(saved) : defaultRequests;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [formData, setFormData] = useState(emptyRequest);

  useEffect(() => {
    localStorage.setItem("approvalRequests", JSON.stringify(requests));
  }, [requests]);

  const approvedCount = requests.filter(
    (item) => item.status === "Approved"
  ).length;

  const pendingCount = requests.filter(
    (item) => item.status === "Pending"
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "Rejected"
  ).length;

  const addRequest = (e) => {
    e.preventDefault();

    const newRequest = {
      id: Date.now(),
      ...formData,
    };

    setRequests((prev) => [newRequest, ...prev]);
    setFormData(emptyRequest);
    setShowModal(false);
  };

  const updateStatus = (id, status) => {
    const note =
      status === "Approved"
        ? "Approved by admin"
        : status === "Rejected"
        ? "Rejected by admin"
        : "";

    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status, note } : request
      )
    );
  };

  const deleteRequest = (id) => {
    if (!window.confirm("Delete this approval request?")) return;

    setRequests((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredRequests = requests.filter((request) => {
    const keyword = searchTerm.toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      request.title.toLowerCase().includes(keyword) ||
      request.requestedBy.toLowerCase().includes(keyword) ||
      request.role.toLowerCase().includes(keyword) ||
      request.reason.toLowerCase().includes(keyword);

    const matchesType =
      typeFilter === "All Types" || request.type === typeFilter;

    const matchesStatus =
      statusFilter === "All Status" || request.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="approvals-page">
      <div className="page-title-row">
        <div>
          <h2>Approvals</h2>
          <p>Manage leave, admission, attendance and document approvals</p>
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FaPlus />
          Add Request
        </button>
      </div>

      <div className="approval-summary-grid">
        <div className="approval-summary-card">
          <div className="approval-summary-icon approved">
            <FaCheckCircle />
          </div>
          <div>
            <p>Approved</p>
            <h3>{approvedCount}</h3>
          </div>
        </div>

        <div className="approval-summary-card">
          <div className="approval-summary-icon pending">
            <FaClock />
          </div>
          <div>
            <p>Pending</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>

        <div className="approval-summary-card">
          <div className="approval-summary-icon rejected">
            <FaTimesCircle />
          </div>
          <div>
            <p>Rejected</p>
            <h3>{rejectedCount}</h3>
          </div>
        </div>
      </div>

      <div className="approvals-filter-card">
        <div className="approvals-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search approval requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option>All Types</option>
          <option>Leave</option>
          <option>Admission</option>
          <option>Attendance</option>
          <option>Document</option>
          <option>Fee</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="approvals-table-card">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Requested By</th>
              <th>Type</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.title}</td>
                  <td>
                    <div className="request-user">
                      <div className="request-avatar">
                        {request.requestedBy.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{request.requestedBy}</h4>
                        <p>{request.role}</p>
                      </div>
                    </div>
                  </td>
                  <td>{request.type}</td>
                  <td>{request.date}</td>
                  <td>{request.reason}</td>
                  <td>
                    <span
                      className={
                        request.status === "Approved"
                          ? "approval-status approved"
                          : request.status === "Rejected"
                          ? "approval-status rejected"
                          : "approval-status pending"
                      }
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="approval-actions">
                      <button
                        className="view-action"
                        onClick={() => setViewRequest(request)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="approve-action"
                        onClick={() => updateStatus(request.id, "Approved")}
                      >
                        <FaCheck />
                      </button>

                      <button
                        className="reject-action"
                        onClick={() => updateStatus(request.id, "Rejected")}
                      >
                        <FaTimes />
                      </button>

                      <button
                        className="delete-action"
                        onClick={() => deleteRequest(request.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 25 }}>
                  No approval requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="approval-modal">
            <div className="modal-header">
              <h3>Add Approval Request</h3>

              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={addRequest}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Request Title</label>
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Requested By</label>
                  <input
                    value={formData.requestedBy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requestedBy: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Staff</option>
                    <option>Parent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option>Leave</option>
                    <option>Admission</option>
                    <option>Attendance</option>
                    <option>Document</option>
                    <option>Fee</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Reason</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    required
                  ></textarea>
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
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewRequest && (
        <div className="modal-overlay">
          <div className="approval-modal">
            <div className="modal-header">
              <h3>Approval Details</h3>

              <button onClick={() => setViewRequest(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="approval-detail-box">
              <p>
                <strong>Title:</strong> {viewRequest.title}
              </p>
              <p>
                <strong>Requested By:</strong> {viewRequest.requestedBy}
              </p>
              <p>
                <strong>Role:</strong> {viewRequest.role}
              </p>
              <p>
                <strong>Type:</strong> {viewRequest.type}
              </p>
              <p>
                <strong>Date:</strong> {viewRequest.date}
              </p>
              <p>
                <strong>Reason:</strong> {viewRequest.reason}
              </p>
              <p>
                <strong>Status:</strong> {viewRequest.status}
              </p>
              <p>
                <strong>Admin Note:</strong> {viewRequest.note || "No note added"}
              </p>

              <div className="modal-actions">
                <button
                  className="save-btn"
                  onClick={() => {
                    updateStatus(viewRequest.id, "Approved");
                    setViewRequest(null);
                  }}
                >
                  Approve
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => {
                    updateStatus(viewRequest.id, "Rejected");
                    setViewRequest(null);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Approvals;