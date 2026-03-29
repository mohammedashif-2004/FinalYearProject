import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";
import Notices from "./pages/Notices";
import Reports from "./pages/Reports";
import AcademicCalendar from "./pages/AcademicCalendar";
import TimeTable from "./pages/TimeTable";
import TeacherProfile from "./pages/TeacherProfile";
import StudentList from "./pages/StudentList";
import AttendanceSummary from "./pages/AttendanceSummary";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDirectory from "./pages/StudentDirectory";
import BulkTeacherUpload from "./pages/BulkTeacherUpload";
import TeacherDirectory from "./pages/TeacherDirectory";
import SubjectManager from "./pages/SubjectManager";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />

        {/* THE FIX: Added the Summary Route here */}
        <Route path="/attendance-summary" element={<ProtectedRoute><AttendanceSummary /></ProtectedRoute>} />

        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><AcademicCalendar /></ProtectedRoute>} />
        <Route path="/timetable" element={<ProtectedRoute><TimeTable /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute><StudentDirectory /> </ProtectedRoute>} />
        <Route path="/bulk-teachers" element={<ProtectedRoute><BulkTeacherUpload /> </ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute><TeacherDirectory /> </ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute><SubjectManager /> </ProtectedRoute>} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;