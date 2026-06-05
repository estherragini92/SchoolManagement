import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import "./ParentAssignments.css";

function ParentAssignments() {
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const loadData = () => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const savedAssignments =
      JSON.parse(localStorage.getItem("assignments")) || [];

    setStudent(students[0] || null);
    setAssignments(savedAssignments);
  };

  useEffect(() => {
    loadData();

    window.addEventListener("dashboardUpdate", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("dashboardUpdate", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const childAssignments = assignments.filter((item) => {
    if (!student) return false;

    return (
      item.className === student.className ||
      item.className?.startsWith(student.className) ||
      item.className?.includes(student.className)
    );
  });

  const completedCount = childAssignments.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingCount = childAssignments.length - completedCount;

  return (
    <div className="parent-assignments-page">
      <div className="page-title-row">
        <div>
          <h2>Assignments</h2>
          <p>View your child&apos;s homework and assignment updates</p>
        </div>
      </div>

      <div className="assignment-summary-grid">
        <div className="assignment-summary-card">
          <FaClipboardList />
          <div>
            <p>Total Assignments</p>
            <h3>{childAssignments.length}</h3>
          </div>
        </div>

        <div className="assignment-summary-card">
          <FaCheckCircle />
          <div>
            <p>Completed</p>
            <h3>{completedCount}</h3>
          </div>
        </div>

        <div className="assignment-summary-card">
          <FaClock />
          <div>
            <p>Pending</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>
      </div>

      <div className="parent-assignment-list">
        {childAssignments.length > 0 ? (
          childAssignments.map((item) => (
            <div className="parent-assignment-card" key={item.id}>
              <div className="assignment-icon">
                <FaClipboardList />
              </div>

              <div className="assignment-info">
                <h3>{item.title}</h3>
                <p>{item.className}</p>

                <p>
                  <FaCalendarAlt /> Due Date: {item.dueDate || "Not set"}
                </p>

                <p>
                  Submissions: {item.submitted || 0}/{item.total || 0}
                </p>
              </div>

              <span
                className={
                  item.status === "Completed"
                    ? "assignment-status completed"
                    : item.status === "Needs Grading"
                    ? "assignment-status grading"
                    : "assignment-status pending"
                }
              >
                {item.status}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-assignment-card">
            <FaClipboardList />
            <h3>No assignments available</h3>
            <p>Assignments created by teachers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentAssignments;