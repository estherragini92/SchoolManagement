import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaBirthdayCake,
  FaPhone,
  FaMapMarkerAlt,
  FaUsers,
  FaSchool,
} from "react-icons/fa";
import "./ParentChildInfo.css";

function ParentChildInfo() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem("students")) || [];

    // For now show first child
    setStudent(students[0]);
  }, []);

  if (!student) {
    return (
      <div className="parent-child-page">
        <h2>Child Information</h2>
        <p>No student information available.</p>
      </div>
    );
  }

  return (
    <div className="parent-child-page">
      <div className="child-header-card">
        <div className="child-photo">
          {student.photo ? (
            <img src={student.photo} alt={student.name} />
          ) : (
            <FaUserGraduate />
          )}
        </div>

        <div>
          <h2>{student.name}</h2>
          <p>
            {student.grade} - {student.section}
          </p>
          <p>Roll No: {student.rollNo}</p>
        </div>
      </div>

      <div className="child-info-grid">

        <div className="child-info-card">
          <FaSchool />
          <div>
            <h4>Class</h4>
            <p>{student.grade} - {student.section}</p>
          </div>
        </div>

        <div className="child-info-card">
          <FaUsers />
          <div>
            <h4>Parent Name</h4>
            <p>{student.parentName}</p>
          </div>
        </div>

        <div className="child-info-card">
          <FaPhone />
          <div>
            <h4>Phone Number</h4>
            <p>{student.phone}</p>
          </div>
        </div>

        <div className="child-info-card">
          <FaBirthdayCake />
          <div>
            <h4>Date of Birth</h4>
            <p>{student.dob}</p>
          </div>
        </div>

        <div className="child-info-card full-width">
          <FaMapMarkerAlt />
          <div>
            <h4>Address</h4>
            <p>{student.address}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ParentChildInfo;