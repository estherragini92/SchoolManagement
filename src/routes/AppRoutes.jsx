
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ParentLayout from "../layouts/ParentLayout";

import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Auth/Login";

// Admin Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import UserManagement from "../pages/UserManagement/UserManagement";
import Academic from "../pages/Academic/Academic";
import Attendance from "../pages/Attendance/Attendance";
import Fees from "../pages/Fees/Fees";
import Communication from "../pages/communication/Communication";
import Reports from "../pages/Reports/Reports";
import Documents from "../pages/Documents/Documents";
import Settings from "../pages/Settings/Settings";
import Approvals from "../pages/Approvals/Approvals";

// Teacher Pages
import TeacherDashboard from "../pages/TeacherDashboard/TeacherDashboard";
import MyClasses from "../pages/MyClasses/MyClasses";
import TeacherStudents from "../pages/TeacherStudents/TeacherStudents";
import TeacherAttendance from "../pages/TeacherAttendance/TeacherAttendance";
import TeacherMessages from "../pages/TeacherMessages/TeacherMessages";
import TeacherSettings from "../pages/TeacherSettings/TeacherSettings";
import Assignments from "../pages/Assignments/Assignments";
import Marks from "../pages/Marks/Marks";

// Parent Pages
import ParentDashboard from "../pages/ParentDashboard/ParentDashboard";
import ParentChildInfo from "../pages/ParentChildInfo/ParentChildInfo";
import ParentAttendance from "../pages/ParentAttendance/ParentAttendance";
import ParentMarks from "../pages/ParentMarks/ParentMarks";
import ParentAssignments from "../pages/ParentAssignments/ParentAssignments";
import ParentMessages from "../pages/ParentMessages/ParentMessages";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      {/* Admin + Teacher */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/approvals" element={<Approvals />} />

        {/* Teacher */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/my-classes" element={<MyClasses />} />
        <Route path="/teacher-students" element={<TeacherStudents />} />
        <Route path="/teacher-attendance" element={<TeacherAttendance />} />
        <Route path="/teacher-messages" element={<TeacherMessages />} />
        <Route path="/teacher-settings" element={<TeacherSettings />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/marks" element={<Marks />} />
      </Route>

      {/* Parent */}
      <Route
        element={
          <ProtectedRoute>
            <ParentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/parent-child" element={<ParentChildInfo />} />
        <Route path="/parent-attendance" element={<ParentAttendance />} />
        <Route path="/parent-marks" element={<ParentMarks />} />
        <Route path="/parent-assignments" element={<ParentAssignments />} />
        <Route path="/parent-messages" element={<ParentMessages />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;

