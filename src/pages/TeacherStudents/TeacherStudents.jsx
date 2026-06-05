import { useEffect, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEnvelope,
  FaChartLine,
  FaUserGraduate,
} from "react-icons/fa";
import "./TeacherStudents.css";

const defaultStudents = [
  {
    id: 1,
    name: "Emma Watson",
    rollNo: "STU-2023-001",
    className: "10-A",
    attendance: 98,
    performance: 92,
    grade: "A+",
    status: "Excellent",
    photo: "",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    rollNo: "STU-2023-042",
    className: "10-B",
    attendance: 82,
    performance: 76,
    grade: "B",
    status: "Need Attention",
    photo: "",
  },
  {
    id: 3,
    name: "Sophia Chen",
    rollNo: "STU-2023-118",
    className: "10-A",
    attendance: 100,
    performance: 88,
    grade: "A",
    status: "Excellent",
    photo: "",
  },
  {
    id: 4,
    name: "Lucas Garcia",
    rollNo: "STU-2023-055",
    className: "10-C",
    attendance: 68,
    performance: 58,
    grade: "C",
    status: "At Risk",
    photo: "",
  },
  {
    id: 5,
    name: "Olivia Smith",
    rollNo: "STU-2023-089",
    className: "10-B",
    attendance: 94,
    performance: 84,
    grade: "A-",
    status: "Good",
    photo: "",
  },
  {
    id: 6,
    name: "Daniel Rivera",
    rollNo: "STU-2023-238",
    className: "10-B",
    attendance: 71,
    performance: 69,
    grade: "C+",
    status: "At Risk",
    photo: "",
  },
];
function TeacherStudents() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");

    if (saved) {
      const adminStudents = JSON.parse(saved);

      return adminStudents.map((student, index) => ({
        id: student.id || Date.now() + index,
        name: student.name,
        rollNo: student.rollNo || `STU-${index + 1}`,
        className: student.section
          ? `Grade ${student.className}-${student.section}`
          : student.className || "Grade 10-A",
        attendance: student.attendance || 90,
        performance: student.performance || 80,
        grade: student.grade || "A",
        status: student.status || "Good",
        photo: student.photo || "",
      }));
    }

    return defaultStudents;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
   localStorage.setItem("students", JSON.stringify(students));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const keyword = searchTerm.toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      student.name.toLowerCase().includes(keyword) ||
      student.rollNo.toLowerCase().includes(keyword);
const matchesClass =
  classFilter === "All Classes" || student.className.includes(classFilter);

    const matchesStatus =
      statusFilter === "All Status" || student.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusClass = (status) => {
    if (status === "Excellent") return "excellent";
    if (status === "Good") return "good";
    if (status === "Need Attention") return "attention";
    return "risk";
  };

  const getBarClass = (value) => {
    if (value >= 85) return "good";
    if (value >= 70) return "medium";
    return "low";
  };

  const totalStudents = students.length;
  const avgAttendance =
    students.length > 0
      ? Math.round(
          students.reduce((sum, item) => sum + Number(item.attendance), 0) /
            students.length
        )
      : 0;

  const avgPerformance =
    students.length > 0
      ? Math.round(
          students.reduce((sum, item) => sum + Number(item.performance), 0) /
            students.length
        )
      : 0;

  const riskCount = students.filter((item) => item.status === "At Risk").length;

  return (
    <div className="teacher-students-page">
      <div className="page-title-row">
        <div>
          <h2>Students</h2>
          <p>Track student attendance, performance and progress</p>
        </div>
      </div>

      <div className="teacher-student-summary">
        <div className="teacher-student-stat">
          <div className="student-stat-icon purple">
            <FaUserGraduate />
          </div>
          <div>
            <p>Total Students</p>
            <h3>{totalStudents}</h3>
          </div>
        </div>

        <div className="teacher-student-stat">
          <div className="student-stat-icon green">
            <FaChartLine />
          </div>
          <div>
            <p>Avg Attendance</p>
            <h3>{avgAttendance}%</h3>
          </div>
        </div>

        <div className="teacher-student-stat">
          <div className="student-stat-icon blue">
            <FaChartLine />
          </div>
          <div>
            <p>Avg Performance</p>
            <h3>{avgPerformance}%</h3>
          </div>
        </div>

        <div className="teacher-student-stat">
          <div className="student-stat-icon red">
            <FaFilter />
          </div>
          <div>
            <p>At Risk</p>
            <h3>{riskCount}</h3>
          </div>
        </div>
      </div>

      <div className="teacher-student-filter-card">
        <div className="teacher-student-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or ID..."
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
  
</select>
        
      </div>

      <div className="teacher-students-table-card">
        <table>
          <thead>
            <tr>
                <th>STUDENT</th>
                <th>CLASS</th>
                <th>ATTENDANCE %</th>
                <th>PERFORMANCE</th>
            </tr>
         </thead>

          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="teacher-student-info">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="teacher-student-photo"
                        />
                      ) : (
                        <div className="teacher-student-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4>{student.name}</h4>
                        <p>{student.rollNo}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="teacher-class-pill">
                      {student.className}
                    </span>
                  </td>

                <td>
                 <div className="attendance-column">
                    <strong>{student.attendance}%</strong>

                    <span className={getStatusClass(student.status)}>
                     {student.status}
                    </span>
                </div>
                </td>

                 <td>
                <div className="teacher-performance-box">
                    <div className="performance-top">
                    <strong>Grade {student.grade}</strong>

                    <span>{student.performance}/100</span>
                    </div>

                    <div className="teacher-progress-track">
                    <div
                        className={`teacher-progress-fill ${getBarClass(
                        student.performance
                        )}`}
                        style={{
                        width: `${student.performance}%`,
                        }}
                    ></div>
                    </div>
                </div>
                </td>

                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 25 }}>
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="teacher-student-modal-overlay">
          <div className="teacher-student-modal">
            <button
              type="button"
              className="teacher-student-close"
              onClick={() => setSelectedStudent(null)}
            >
              ×
            </button>

            <div className="student-profile-large">
              {selectedStudent.photo ? (
                <img src={selectedStudent.photo} alt={selectedStudent.name} />
              ) : (
                <div className="student-profile-avatar">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
              )}

              <h2>{selectedStudent.name}</h2>
              <p>{selectedStudent.rollNo}</p>
            </div>

            <div className="student-detail-grid">
              <div>
                <span>Class</span>
                <strong>{selectedStudent.className}</strong>
              </div>

              <div>
                <span>Attendance</span>
                <strong>{selectedStudent.attendance}%</strong>
              </div>

              <div>
                <span>Performance</span>
                <strong>{selectedStudent.performance}%</strong>
              </div>

              <div>
                <span>Grade</span>
                <strong>{selectedStudent.grade}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedStudent.status}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherStudents;