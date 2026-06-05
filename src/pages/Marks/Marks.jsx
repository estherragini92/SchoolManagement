import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaCheckCircle,
} from "react-icons/fa";
import "./Marks.css";

const defaultMarks = [
  {
    id: 1,
    studentName: "Arjun Kumar",
    className: "Grade 6",
    subject: "Mathematics",
    examType: "Unit Test",
    marksObtained: 88,
    totalMarks: 100,
    percentage: 88,
    grade: "A",
    remarks: "Very good performance",
  },
  {
    id: 2,
    studentName: "Priya Sharma",
    className: "Grade 7",
    subject: "Science",
    examType: "Midterm",
    marksObtained: 94,
    totalMarks: 100,
    percentage: 94,
    grade: "A+",
    remarks: "Excellent work",
  },
  {
    id: 3,
    studentName: "Kavin Raj",
    className: "Grade 8",
    subject: "English",
    examType: "Quarterly",
    marksObtained: 72,
    totalMarks: 100,
    percentage: 72,
    grade: "B",
    remarks: "Good, can improve grammar",
  },
];

const emptyMark = {
  studentName: "",
  className: "",
  subject: "",
  examType: "Unit Test",
  marksObtained: "",
  totalMarks: 100,
  remarks: "",
};

function calculateGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  return "D";
}

function normalizeGrade(value) {
  if (!value) return "";

  const text = String(value).trim();

  if (text.toLowerCase().startsWith("grade")) {
    const number = text.match(/\d+/)?.[0];
    return number ? `Grade ${number}` : text;
  }

  const number = text.match(/\d+/)?.[0];
  return number ? `Grade ${number}` : text;
}

function Marks() {
  const [marks, setMarks] = useState(() => {
    const saved = localStorage.getItem("marks");
    return saved ? JSON.parse(saved) : defaultMarks;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [examFilter, setExamFilter] = useState("All Exams");
  const [classFilter, setClassFilter] = useState("All Classes");

  const [showModal, setShowModal] = useState(false);
  const [viewMark, setViewMark] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [markForm, setMarkForm] = useState({ ...emptyMark });

  const allStudents = JSON.parse(localStorage.getItem("students")) || [];

  const studentsByClass = allStudents.filter((student) => {
    if (!markForm.className) return false;

    const studentGrade = normalizeGrade(student.className);
    const selectedGrade = normalizeGrade(markForm.className);

    return studentGrade === selectedGrade;
  });

  useEffect(() => {
    localStorage.setItem("marks", JSON.stringify(marks));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [marks]);

  const totalEntries = marks.length;

  const averagePercentage =
    marks.length > 0
      ? Math.round(
          marks.reduce((sum, item) => sum + Number(item.percentage || 0), 0) /
            marks.length
        )
      : 0;

  const highestScore =
    marks.length > 0
      ? Math.max(...marks.map((item) => Number(item.percentage || 0)))
      : 0;

  const passPercentage =
    marks.length > 0
      ? Math.round(
          (marks.filter((item) => Number(item.percentage) >= 40).length /
            marks.length) *
            100
        )
      : 0;

  const topPerformers = [...marks]
    .sort((a, b) => Number(b.percentage) - Number(a.percentage))
    .slice(0, 3);

  const openAddModal = () => {
    setEditingId(null);
    setMarkForm({ ...emptyMark });
    setShowModal(true);
  };

  const openEditModal = (mark) => {
    setEditingId(mark.id);
    setMarkForm({
      studentName: mark.studentName || "",
      className: normalizeGrade(mark.className) || "",
      subject: mark.subject || "",
      examType: mark.examType || "Unit Test",
      marksObtained: mark.marksObtained || "",
      totalMarks: mark.totalMarks || 100,
      remarks: mark.remarks || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setMarkForm({ ...emptyMark });
  };

  const saveMark = (e) => {
    e.preventDefault();

    const obtained = Number(markForm.marksObtained);
    const total = Number(markForm.totalMarks);

    if (obtained > total) {
      alert("Marks obtained cannot be greater than total marks");
      return;
    }

    const percentage = total > 0 ? Math.round((obtained / total) * 100) : 0;
    const grade = calculateGrade(percentage);

    const selectedStudent = allStudents.find(
      (student) => student.name === markForm.studentName
    );

    const newMark = {
      id: editingId || Date.now(),
      studentName: markForm.studentName,
      className: normalizeGrade(markForm.className),
      section: selectedStudent?.section || "",
      subject: markForm.subject,
      examType: markForm.examType,
      marksObtained: obtained,
      totalMarks: total,
      percentage,
      grade,
      remarks: markForm.remarks,
    };

    if (editingId) {
      setMarks((prev) =>
        prev.map((item) => (item.id === editingId ? newMark : item))
      );
    } else {
      setMarks((prev) => [newMark, ...prev]);
    }
const existingStudents = JSON.parse(localStorage.getItem("students")) || [];

const updatedStudents = existingStudents.map((student) =>
  student.name === newMark.studentName
    ? {
        ...student,
        performance: newMark.percentage,
        grade: newMark.grade,
      }
    : student
);

localStorage.setItem("students", JSON.stringify(updatedStudents));
    const activities =
      JSON.parse(localStorage.getItem("dashboardActivities")) || [];

    localStorage.setItem(
      "dashboardActivities",
      JSON.stringify(
        [
          `${newMark.studentName}'s ${newMark.subject} marks ${
            editingId ? "updated" : "added"
          }`,
          ...activities,
        ].slice(0, 10)
      )
    );

    window.dispatchEvent(new Event("dashboardUpdate"));
    closeModal();
  };

  const deleteMark = (id) => {
    if (!window.confirm("Delete this marks record?")) return;
    setMarks((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredMarks = marks.filter((mark) => {
    const keyword = searchTerm.toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      mark.studentName.toLowerCase().includes(keyword) ||
      mark.subject.toLowerCase().includes(keyword) ||
      mark.className.toLowerCase().includes(keyword);

    const matchesExam =
      examFilter === "All Exams" || mark.examType === examFilter;

    const matchesClass =
      classFilter === "All Classes" ||
      normalizeGrade(mark.className) === classFilter;

    return matchesSearch && matchesExam && matchesClass;
  });

  return (
    <div className="marks-page">
      <div className="page-title-row">
        <div>
          <h2>Exams & Marks</h2>
          <p>Enter marks, calculate grades and track student performance</p>
        </div>

        <button type="button" className="add-btn" onClick={openAddModal}>
          <FaPlus />
          Add Marks
        </button>
      </div>

      <div className="marks-summary-grid">
        <div className="marks-summary-card">
          <div className="marks-summary-icon blue">
            <FaGraduationCap />
          </div>
          <div>
            <p>Total Entries</p>
            <h3>{totalEntries}</h3>
          </div>
        </div>

        <div className="marks-summary-card">
          <div className="marks-summary-icon green">
            <FaChartLine />
          </div>
          <div>
            <p>Average Percentage</p>
            <h3>{averagePercentage}%</h3>
          </div>
        </div>

        <div className="marks-summary-card">
          <div className="marks-summary-icon orange">
            <FaTrophy />
          </div>
          <div>
            <p>Highest Score</p>
            <h3>{highestScore}%</h3>
          </div>
        </div>

        <div className="marks-summary-card">
          <div className="marks-summary-icon purple">
            <FaCheckCircle />
          </div>
          <div>
            <p>Pass Percentage</p>
            <h3>{passPercentage}%</h3>
          </div>
        </div>
      </div>

      <div className="marks-layout">
        <div className="marks-main">
          <div className="marks-filter-card">
            <div className="marks-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search student, subject or class..."
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
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
            >
              <option>All Exams</option>
              <option>Unit Test</option>
              <option>Midterm</option>
              <option>Quarterly</option>
              <option>Half-Yearly</option>
              <option>Annual Exam</option>
            </select>
          </div>

          <div className="marks-table-card">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Exam</th>
                  <th>Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMarks.length > 0 ? (
                  filteredMarks.map((mark) => (
                    <tr key={mark.id}>
                      <td>
                        <div className="mark-student">
                          <div className="mark-avatar">
                            {mark.studentName.charAt(0).toUpperCase()}
                          </div>
                          <span>{mark.studentName}</span>
                        </div>
                      </td>

                      <td>
                        {mark.className}
                        {mark.section ? `-${mark.section}` : ""}
                      </td>
                      <td>{mark.subject}</td>
                      <td>{mark.examType}</td>
                      <td>
                        {mark.marksObtained}/{mark.totalMarks}
                      </td>

                      <td>
                        <div className="mark-progress-box">
                          <div className="mark-progress-track">
                            <div
                              className="mark-progress-fill"
                              style={{ width: `${mark.percentage}%` }}
                            ></div>
                          </div>
                          <span>{mark.percentage}%</span>
                        </div>
                      </td>

                      <td>
                        <span className={`grade-badge grade-${mark.grade}`}>
                          {mark.grade}
                        </span>
                      </td>

                      <td>
                        <div className="marks-actions">
                          <button
                            type="button"
                            onClick={() => setViewMark(mark)}
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(mark)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteMark(mark.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: 25 }}>
                      No marks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="top-performers-card">
          <h3>Top Performers</h3>
          <p>Based on percentage</p>

          {topPerformers.length > 0 ? (
            topPerformers.map((student, index) => (
              <div className="performer-item" key={student.id}>
                <div className="performer-rank">{index + 1}</div>
                <div>
                  <h4>{student.studentName}</h4>
                  <p>
                    {student.subject} · {student.percentage}%
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No data yet</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="marks-modal-overlay">
          <div className="marks-modal">
            <div className="modal-header">
              <h3>{editingId ? "Edit Marks" : "Add Marks"}</h3>

              <button type="button" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveMark}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Grade</label>
                  <select
                    value={markForm.className}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        className: e.target.value,
                        studentName: "",
                      })
                    }
                    required
                  >
                    <option value="">Select Grade</option>
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
                </div>

                <div className="form-group">
                  <label>Student Name</label>
                  <select
                    value={markForm.studentName}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        studentName: e.target.value,
                      })
                    }
                    required
                    disabled={!markForm.className}
                  >
                    <option value="">
                      {markForm.className
                        ? "Select Student"
                        : "Select Grade First"}
                    </option>

                    {studentsByClass.map((student) => (
                      <option key={student.id} value={student.name}>
                        {student.name}
                        {student.section ? ` - Section ${student.section}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    value={markForm.subject}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        subject: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Exam Type</label>
                  <select
                    value={markForm.examType}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        examType: e.target.value,
                      })
                    }
                  >
                    <option>Unit Test</option>
                    <option>Midterm</option>
                    <option>Quarterly</option>
                    <option>Half-Yearly</option>
                    <option>Annual Exam</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marks Obtained</label>
                  <input
                    type="number"
                    min="0"
                    value={markForm.marksObtained}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        marksObtained: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={markForm.totalMarks}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        totalMarks: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Remarks</label>
                  <textarea
                    value={markForm.remarks}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        remarks: e.target.value,
                      })
                    }
                    placeholder="Excellent performance / Needs improvement..."
                  ></textarea>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingId ? "Update Marks" : "Save Marks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMark && (
        <div className="marks-modal-overlay">
          <div className="marks-modal">
            <div className="modal-header">
              <h3>Marks Details</h3>

              <button type="button" onClick={() => setViewMark(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="marks-detail-box">
              <h2>{viewMark.studentName}</h2>
              <p>
                <strong>Class:</strong> {viewMark.className}
                {viewMark.section ? `-${viewMark.section}` : ""}
              </p>
              <p>
                <strong>Subject:</strong> {viewMark.subject}
              </p>
              <p>
                <strong>Exam:</strong> {viewMark.examType}
              </p>
              <p>
                <strong>Marks:</strong> {viewMark.marksObtained}/
                {viewMark.totalMarks}
              </p>
              <p>
                <strong>Percentage:</strong> {viewMark.percentage}%
              </p>
              <p>
                <strong>Grade:</strong> {viewMark.grade}
              </p>
              <p>
                <strong>Remarks:</strong> {viewMark.remarks || "No remarks"}
              </p>

              <button
                type="button"
                className="save-btn"
                onClick={() => setViewMark(null)}
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

export default Marks;