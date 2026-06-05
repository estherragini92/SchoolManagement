import { useEffect, useState } from "react";
import {
  FaSave,
  FaSearch,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import "./TeacherAttendance.css";

const defaultStudents = [
  {
    id: 1,
    name: "Emma Watson",
    rollNo: "01",
    className: "Grade 1-A",
    status: "Present",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    rollNo: "02",
    className: "Grade 1-B",
    status: "Absent",
  },
  {
    id: 3,
    name: "Sophia Chen",
    rollNo: "03",
    className: "Grade 2-A",
    status: "Present",
  },
  {
    id: 4,
    name: "Lucas Garcia",
    rollNo: "04",
    className: "Grade 2-B",
    status: "Late",
  },
  {
    id: 5,
    name: "Olivia Smith",
    rollNo: "05",
    className: "Grade 3-A",
    status: "Present",
  },
];

function normalizeStudentForAttendance(student, index) {
  let className = student.className || "Grade 1";

  if (student.section && !className.includes("-")) {
    className = `${className}-${student.section}`;
  }

  return {
    id: student.id || Date.now() + index,
    name: student.name || "Unnamed Student",
    rollNo: student.rollNo || student.idNo || String(index + 1).padStart(2, "0"),
    className,
    status: student.attendanceStatus || student.status || "Present",
  };
}

function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState("All Grades");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [attendance, setAttendance] = useState(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students")) || [];

    if (savedStudents.length > 0) {
      return savedStudents.map((student, index) =>
        normalizeStudentForAttendance(student, index)
      );
    }

    const savedAttendance =
      JSON.parse(localStorage.getItem("studentAttendance")) || [];

    return savedAttendance.length > 0 ? savedAttendance : defaultStudents;
  });

  useEffect(() => {
    const loadStudents = () => {
      const savedStudents = JSON.parse(localStorage.getItem("students")) || [];
      const savedAttendance =
        JSON.parse(localStorage.getItem("studentAttendance")) || [];

      if (savedStudents.length === 0) {
        setAttendance(savedAttendance.length > 0 ? savedAttendance : defaultStudents);
        return;
      }

      const mergedAttendance = savedStudents.map((student, index) => {
        const normalized = normalizeStudentForAttendance(student, index);

        const oldAttendance = savedAttendance.find(
          (item) => item.id === normalized.id || item.name === normalized.name
        );

        return {
          ...normalized,
          status: oldAttendance?.status || normalized.status || "Present",
          date: oldAttendance?.date || selectedDate,
        };
      });

      setAttendance(mergedAttendance);
    };

    loadStudents();

    window.addEventListener("storage", loadStudents);

    return () => {
      window.removeEventListener("storage", loadStudents);
    };
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("studentAttendance", JSON.stringify(attendance));
  }, [attendance]);

  const gradeStudents =
  selectedClass === "All Grades"
    ? attendance
    : attendance.filter((student) =>
        student.className?.startsWith(selectedClass)
      );
  const filteredStudents = gradeStudents.filter((student) => {
    const keyword = searchTerm.toLowerCase().trim();

    return (
      keyword === "" ||
      student.name.toLowerCase().includes(keyword) ||
      student.rollNo.toLowerCase().includes(keyword)
    );
  });

  const presentCount = gradeStudents.filter(
    (student) => student.status === "Present"
  ).length;

  const absentCount = gradeStudents.filter(
    (student) => student.status === "Absent"
  ).length;

  const lateCount = gradeStudents.filter(
    (student) => student.status === "Late"
  ).length;

  const totalCount = gradeStudents.length;

  const attendancePercentage =
    totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const updateStatus = (id, status) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              status,
              date: selectedDate,
            }
          : student
      )
    );
  };

  const saveAttendance = () => {
    const records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

    const newRecord = {
      id: Date.now(),
      className: selectedClass,
      date: selectedDate,
      students: gradeStudents,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      percentage: attendancePercentage,
    };

    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify([newRecord, ...records])
    );

    const oldStudents = JSON.parse(localStorage.getItem("students")) || [];

    const updatedStudents = oldStudents.map((student) => {
      const attendanceRecord = attendance.find(
        (item) => item.id === student.id || item.name === student.name
      );

      return attendanceRecord
        ? {
            ...student,
            attendanceStatus: attendanceRecord.status,
            attendance: attendancePercentage,
          }
        : student;
    });

    localStorage.setItem("students", JSON.stringify(updatedStudents));

    const activities =
      JSON.parse(localStorage.getItem("dashboardActivities")) || [];

    localStorage.setItem(
      "dashboardActivities",
      JSON.stringify(
        [`Attendance marked for ${selectedClass}`, ...activities].slice(0, 10)
      )
    );

    window.dispatchEvent(new Event("dashboardUpdate"));
    alert("Attendance saved successfully");
  };

  return (
    <div className="teacher-attendance-page">
      <div className="page-title-row">
        <div>
          <h2>Attendance Marking</h2>
          <p>Mark present, absent and late students for your class</p>
        </div>

        <button
          type="button"
          className="save-attendance-btn"
          onClick={saveAttendance}
        >
          <FaSave />
          Save Attendance
        </button>
      </div>

      <div className="attendance-stats-grid">
        <div className="attendance-stat-card">
          <div className="attendance-stat-icon total">
            <FaUsers />
          </div>
          <div>
            <p>Total Students</p>
            <h3>{totalCount}</h3>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon present">
            <FaCheckCircle />
          </div>
          <div>
            <p>Present</p>
            <h3>{presentCount}</h3>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon absent">
            <FaTimesCircle />
          </div>
          <div>
            <p>Absent</p>
            <h3>{absentCount}</h3>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon late">
            <FaClock />
          </div>
          <div>
            <p>Late</p>
            <h3>{lateCount}</h3>
          </div>
        </div>
      </div>

      <div className="teacher-attendance-layout">
        <div className="attendance-mark-card">
          <div className="attendance-toolbar">
             <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="All Grades">All Grades</option>

              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={`Grade ${i + 1}`}>
                  Grade {i + 1}
                </option>
              ))}
            </select>

            <div className="attendance-date">
              <FaCalendarAlt />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="attendance-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="attendance-list">
            {filteredStudents.map((student) => (
              <div className="attendance-row" key={student.id}>
                <div className="attendance-student-info">
                  <div className="attendance-avatar">
                    {student.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h4>{student.name}</h4>
                    <p>
                      Roll No: {student.rollNo} · {student.className}
                    </p>
                  </div>
                </div>

                <div className="attendance-status-buttons">
                  <button
                    type="button"
                    className={
                      student.status === "Present" ? "present active" : ""
                    }
                    onClick={() => updateStatus(student.id, "Present")}
                  >
                    <FaCheckCircle />
                    Present
                  </button>

                  <button
                    type="button"
                    className={
                      student.status === "Absent" ? "absent active" : ""
                    }
                    onClick={() => updateStatus(student.id, "Absent")}
                  >
                    <FaTimesCircle />
                    Absent
                  </button>

                  <button
                    type="button"
                    className={student.status === "Late" ? "late active" : ""}
                    onClick={() => updateStatus(student.id, "Late")}
                  >
                    <FaClock />
                    Late
                  </button>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <p className="empty-attendance">
                No students found for {selectedClass}
              </p>
            )}
          </div>
        </div>

        <div className="attendance-analytics-card">
          <h3>Monthly Analytics</h3>
          <p>Attendance percentage</p>

          <div className="attendance-circle">
            <h2>{attendancePercentage}%</h2>
            <span>Present Rate</span>
          </div>

          <div className="class-percent-list">
            <div>
              <span>{selectedClass}</span>
              <strong>{attendancePercentage}%</strong>
            </div>

            <div>
              <span>Total Students</span>
              <strong>{totalCount}</strong>
            </div>

            <div>
              <span>Present</span>
              <strong>{presentCount}</strong>
            </div>

            <div>
              <span>Absent / Late</span>
              <strong>{absentCount + lateCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendance;