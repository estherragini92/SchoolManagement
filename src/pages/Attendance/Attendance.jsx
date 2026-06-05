import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSave,
  FaSearch,
} from "react-icons/fa";
import "./Attendance.css";

const defaultStudents = [
  { id: 1, name: "Arjun Kumar", rollNo: "STU001", className: "5-A", status: "Present", remarks: "" },
  { id: 2, name: "Priya Sharma", rollNo: "STU002", className: "6-B", status: "Absent", remarks: "" },
  { id: 3, name: "Kavin Raj", rollNo: "STU003", className: "8-A", status: "Late", remarks: "" },
];

const defaultStaff = [
  { id: 1, name: "Mrs. Lakshmi", department: "Science", role: "Teacher", status: "Present", remarks: "" },
  { id: 2, name: "Mr. Kumar", department: "Mathematics", role: "Teacher", status: "Present", remarks: "" },
  { id: 3, name: "Ms. Priya", department: "English", role: "Teacher", status: "Leave", remarks: "" },
];

function Attendance() {
  const [activeTab, setActiveTab] = useState("students");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [studentAttendance, setStudentAttendance] = useState(() => {
    return JSON.parse(localStorage.getItem("studentAttendance")) || defaultStudents;
  });

  const [staffAttendance, setStaffAttendance] = useState(() => {
    return JSON.parse(localStorage.getItem("staffAttendance")) || defaultStaff;
  });

  useEffect(() => {
    localStorage.setItem("studentAttendance", JSON.stringify(studentAttendance));
  }, [studentAttendance]);

  useEffect(() => {
    localStorage.setItem("staffAttendance", JSON.stringify(staffAttendance));
  }, [staffAttendance]);

  const updateStudentStatus = (id, value) => {
    setStudentAttendance((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: value } : item))
    );
  };

  const updateStaffStatus = (id, value) => {
    setStaffAttendance((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: value } : item))
    );
  };

  const updateStudentRemarks = (id, value) => {
    setStudentAttendance((prev) =>
      prev.map((item) => (item.id === id ? { ...item, remarks: value } : item))
    );
  };

  const updateStaffRemarks = (id, value) => {
    setStaffAttendance((prev) =>
      prev.map((item) => (item.id === id ? { ...item, remarks: value } : item))
    );
  };

  const saveAttendance = () => {
    const key =
      activeTab === "students"
        ? `studentAttendance-${selectedDate}`
        : `staffAttendance-${selectedDate}`;

    const data = activeTab === "students" ? studentAttendance : staffAttendance;

    localStorage.setItem(key, JSON.stringify(data));
    alert(`${activeTab === "students" ? "Student" : "Staff"} attendance saved for ${selectedDate}`);
  };

  const filteredStudents = studentAttendance.filter((student) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(keyword) ||
      student.rollNo.toLowerCase().includes(keyword) ||
      student.className.toLowerCase().includes(keyword);

    const matchesClass =
      classFilter === "All Classes" || student.className === classFilter;

    const matchesStatus =
      statusFilter === "All Status" || student.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const filteredStaff = staffAttendance.filter((staff) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      staff.name.toLowerCase().includes(keyword) ||
      staff.department.toLowerCase().includes(keyword) ||
      staff.role.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "All Status" || staff.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
const currentAttendance =
  activeTab === "students" ? studentAttendance : staffAttendance;

const presentCount = currentAttendance.filter(
  (item) => item.status === "Present"
).length;

const absentCount = currentAttendance.filter(
  (item) => item.status === "Absent"
).length;

const lateCount = currentAttendance.filter(
  (item) => item.status === "Late"
).length;

const leaveCount = currentAttendance.filter(
  (item) => item.status === "Leave"
).length;

  return (
    <div className="attendance-page">
      <div className="page-title-row">
        <div>
          <h2>Attendance Management</h2>
          <p>Mark and save student and staff attendance</p>
        </div>

        <button className="save-attendance-btn" onClick={saveAttendance}>
          <FaSave />
          Save Attendance
        </button>
      </div>

      <div className="attendance-summary">
        <div className="attendance-card">
          <div className="summary-icon present">
            <FaCalendarCheck />
          </div>
          <div>
            <p>Present</p>
            <h3>{presentCount}</h3>
          </div>
        </div>

        <div className="attendance-card">
          <div className="summary-icon absent">
            <FaUserGraduate />
          </div>
          <div>
            <p>Absent</p>
            <h3>{absentCount}</h3>
          </div>
        </div>

        <div className="attendance-card">
          <div className="summary-icon late">
            <FaChalkboardTeacher />
          </div>
          <div>
            <p>Late</p>
            <h3>{lateCount}</h3>
          </div>
        </div>
        <div className="attendance-card">
        <div className="summary-icon leave">
          <FaCalendarCheck />
        </div>

        <div>
          <p>Leave</p>
          <h3>{leaveCount}</h3>
        </div>
      </div>
      </div>

      <div className="attendance-tabs">
        <button
          className={activeTab === "students" ? "active" : ""}
          onClick={() => setActiveTab("students")}
        >
          Student Attendance
        </button>

        <button
          className={activeTab === "staff" ? "active" : ""}
          onClick={() => setActiveTab("staff")}
        >
          Staff Attendance
        </button>
      </div>

      <div className="attendance-filter-card">
        <div className="attendance-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search name, roll number, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {activeTab === "students" && (
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option>All Classes</option>
            <option value="5-A">Grade 5-A</option>
            <option value="6-B">Grade 6-B</option>
            <option value="8-A">Grade 8-A</option>
          </select>
        )}

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All Status</option>
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
          <option>Excused</option>
          <option>Leave</option>
        </select>
      </div>

      {activeTab === "students" && (
        <div className="attendance-table-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="person-info">
                      <div className="person-avatar">{student.name.charAt(0)}</div>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td>{student.rollNo}</td>
                  <td>{student.className}</td>
                  <td>
                    <select
                      className={`attendance-status ${student.status.toLowerCase()}`}
                      value={student.status}
                      onChange={(e) => updateStudentStatus(student.id, e.target.value)}
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Late</option>
                      <option>Excused</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="remarks-input"
                      type="text"
                      placeholder="Add remarks"
                      value={student.remarks}
                      onChange={(e) => updateStudentRemarks(student.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "staff" && (
        <div className="attendance-table-card">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div className="person-info">
                      <div className="person-avatar">{staff.name.charAt(0)}</div>
                      <span>{staff.name}</span>
                    </div>
                  </td>
                  <td>{staff.department}</td>
                  <td>{staff.role}</td>
                  <td>
                    <select
                      className={`attendance-status ${staff.status.toLowerCase()}`}
                      value={staff.status}
                      onChange={(e) => updateStaffStatus(staff.id, e.target.value)}
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Late</option>
                      <option>Leave</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="remarks-input"
                      type="text"
                      placeholder="Add remarks"
                      value={staff.remarks}
                      onChange={(e) => updateStaffRemarks(staff.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Attendance;