import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaUserGraduate,
  FaCalendarCheck,
  FaRupeeSign,
  FaDownload,
  FaSearch,
  FaPrint,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import "./Reports.css";

function Reports() {
  const [activeTab, setActiveTab] = useState("academic");
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All Grades");

  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students")) || []);
    setPayments(JSON.parse(localStorage.getItem("feePayments")) || []);
    setAttendance(JSON.parse(localStorage.getItem("studentAttendance")) || []);
  }, []);

  const academicData = [
    { subject: "Math", score: 88 },
    { subject: "Science", score: 82 },
    { subject: "English", score: 91 },
    { subject: "Social", score: 79 },
    { subject: "Computer", score: 86 },
  ];

  const attendanceData = [
    {
      name: "Present",
      value: attendance.filter((item) => item.status === "Present").length || 12,
    },
    {
      name: "Absent",
      value: attendance.filter((item) => item.status === "Absent").length || 3,
    },
    {
      name: "Late",
      value: attendance.filter((item) => item.status === "Late").length || 2,
    },
    {
      name: "Leave",
      value: attendance.filter((item) => item.status === "Leave").length || 1,
    },
  ];

  const financeData = [
    { month: "Jan", amount: 45000 },
    { month: "Feb", amount: 52000 },
    { month: "Mar", amount: 48000 },
    { month: "Apr", amount: 61000 },
    { month: "May", amount: 57000 },
    { month: "Jun", amount: 72000 },
  ];

  const gradeData = [
    { grade: "Grade 1", students: 32 },
    { grade: "Grade 2", students: 38 },
    { grade: "Grade 3", students: 41 },
    { grade: "Grade 4", students: 35 },
    { grade: "Grade 5", students: 45 },
    { grade: "Grade 6", students: 40 },
    { grade: "Grade 7", students: 37 },
    { grade: "Grade 8", students: 42 },
  ];

  const totalCollection =
    payments.length > 0
      ? payments
          .filter((item) => item.status === "Paid")
          .reduce((sum, item) => sum + Number(item.amount || 0), 0)
      : 845000;

  const totalStudents = students.length || 1250;

  const presentCount =
    attendance.filter((item) => item.status === "Present").length || 920;

  const attendancePercent = Math.round((presentCount / totalStudents) * 100);

  const exportReport = () => {
    const reportText = `
EduSmart Reports

Report Type: ${activeTab}
Total Students: ${totalStudents}
Attendance: ${attendancePercent}%
Total Collection: ₹${totalCollection.toLocaleString("en-IN")}
Generated At: ${new Date().toLocaleString()}
`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-report.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const filteredAcademicData = academicData.filter((item) =>
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reports-page">
      <div className="page-title-row">
        <div>
          <h2>Reports & Analytics</h2>
          <p>View academic, attendance and financial performance reports</p>
        </div>

        <div className="report-actions">
          <button className="print-btn" onClick={printReport}>
            <FaPrint />
            Print
          </button>

          <button className="export-btn" onClick={exportReport}>
            <FaDownload />
            Export Report
          </button>
        </div>
      </div>

      <div className="report-summary-grid">
        <div className="report-summary-card">
          <div className="report-summary-icon blue">
            <FaUserGraduate />
          </div>
          <div>
            <p>Total Students</p>
            <h3>{totalStudents}</h3>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon green">
            <FaCalendarCheck />
          </div>
          <div>
            <p>Attendance Rate</p>
            <h3>{attendancePercent}%</h3>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon purple">
            <FaChartBar />
          </div>
          <div>
            <p>Average Score</p>
            <h3>85%</h3>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon orange">
            <FaRupeeSign />
          </div>
          <div>
            <p>Total Collection</p>
            <h3>₹{totalCollection.toLocaleString("en-IN")}</h3>
          </div>
        </div>
      </div>

      <div className="report-tabs">
        <button
          className={activeTab === "academic" ? "active" : ""}
          onClick={() => setActiveTab("academic")}
        >
          Academic
        </button>

        <button
          className={activeTab === "attendance" ? "active" : ""}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance
        </button>

        <button
          className={activeTab === "finance" ? "active" : ""}
          onClick={() => setActiveTab("finance")}
        >
          Financial
        </button>

        <button
          className={activeTab === "students" ? "active" : ""}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
      </div>

      <div className="reports-filter-card">
        <div className="reports-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option>All Grades</option>
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

      {activeTab === "academic" && (
        <div className="report-layout">
          <div className="report-chart-card wide">
            <div className="chart-title-row">
              <div>
                <h3>Subject Performance</h3>
                <p>Average score by subject</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={330}>
              <BarChart data={filteredAcademicData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" radius={[12, 12, 0, 0]} fill="#3438d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="report-side-card">
            <h3>Academic Insights</h3>

            <div className="insight-item">
              <span>Top Subject</span>
              <strong>English - 91%</strong>
            </div>

            <div className="insight-item">
              <span>Needs Improvement</span>
              <strong>Social - 79%</strong>
            </div>

            <div className="insight-item">
              <span>Overall Grade</span>
              <strong>A</strong>
            </div>
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="report-layout">
          <div className="report-chart-card">
            <h3>Attendance Distribution</h3>
            <p>Present, absent, late and leave split</p>

            <ResponsiveContainer width="100%" height={330}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={115}
                  label
                >
                  {attendanceData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={["#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="report-side-card">
            <h3>Attendance Summary</h3>

            {attendanceData.map((item) => (
              <div className="insight-item" key={item.name}>
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "finance" && (
        <div className="report-layout">
          <div className="report-chart-card wide">
            <h3>Fee Collection Trend</h3>
            <p>Monthly collection analytics</p>

            <ResponsiveContainer width="100%" height={330}>
              <LineChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="report-side-card">
            <h3>Finance Insights</h3>

            <div className="insight-item">
              <span>Best Month</span>
              <strong>June</strong>
            </div>

            <div className="insight-item">
              <span>Total Collection</span>
              <strong>₹{totalCollection.toLocaleString("en-IN")}</strong>
            </div>

            <div className="insight-item">
              <span>Pending</span>
              <strong>₹1,25,000</strong>
            </div>
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div className="report-layout">
          <div className="report-chart-card wide">
            <h3>Students by Grade</h3>
            <p>Total student strength across grades</p>

            <ResponsiveContainer width="100%" height={330}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" radius={[12, 12, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="report-side-card">
            <h3>Student Insights</h3>

            <div className="insight-item">
              <span>Total Students</span>
              <strong>{totalStudents}</strong>
            </div>

            <div className="insight-item">
              <span>Highest Strength</span>
              <strong>Grade 5</strong>
            </div>

            <div className="insight-item">
              <span>Active Grades</span>
              <strong>8</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;