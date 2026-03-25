import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

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
import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
                <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
                <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><AcademicCalendar /></ProtectedRoute>} />
                <Route path="/timetable" element={<ProtectedRoute><TimeTable /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);