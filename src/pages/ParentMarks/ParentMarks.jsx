import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaPercentage,
  FaAward,
  FaBookOpen,
} from "react-icons/fa";
import "./ParentMarks.css";

function ParentMarks() {
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);

  const loadData = () => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const allMarks = JSON.parse(localStorage.getItem("marks")) || [];

    setStudent(students[0]);
    setMarks(allMarks);
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

  const childMarks = marks.filter(
    (item) => item.studentName === student?.name
  );

  const average =
    childMarks.length > 0
      ? Math.round(
          childMarks.reduce(
            (sum, item) => sum + Number(item.percentage || 0),
            0
          ) / childMarks.length
        )
      : 0;

  const highest =
    childMarks.length > 0
      ? Math.max(...childMarks.map((item) => Number(item.percentage || 0)))
      : 0;

  return (
    <div className="parent-marks-page">
      <div className="page-title-row">
        <div>
          <h2>Marks & Results</h2>
          <p>Track your child's academic performance</p>
        </div>
      </div>

      <div className="marks-summary-grid">
        <div className="marks-summary-card">
          <FaChartLine />
          <div>
            <p>Average Score</p>
            <h3>{average}%</h3>
          </div>
        </div>

        <div className="marks-summary-card">
          <FaAward />
          <div>
            <p>Highest Score</p>
            <h3>{highest}%</h3>
          </div>
        </div>

        <div className="marks-summary-card">
          <FaPercentage />
          <div>
            <p>Total Exams</p>
            <h3>{childMarks.length}</h3>
          </div>
        </div>

        <div className="marks-summary-card">
          <FaBookOpen />
          <div>
            <p>Student</p>
            <h3>{student?.name || "-"}</h3>
          </div>
        </div>
      </div>

      <div className="marks-table-card">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Exam Type</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {childMarks.length > 0 ? (
              childMarks.map((item) => (
                <tr key={item.id}>
                  <td>{item.subject}</td>
                  <td>{item.examType}</td>
                  <td>{item.marks}</td>
                  <td>{item.percentage}%</td>
                  <td>{item.grade}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No marks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParentMarks;