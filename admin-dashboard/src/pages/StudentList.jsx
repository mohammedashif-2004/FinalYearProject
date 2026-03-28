import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

const YEAR_LABEL = { 1: "FYBCA", 2: "SYBCA", 3: "TYBCA" };

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ year: "", division: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/api/admin/students/${id}`);
        setStudents(students.filter((s) => s.id !== id));
      } catch (error) {
        alert("Failed to delete student");
      }
    }
  };

  // Filter Logic
  const filteredStudents = students.filter((s) => {
    const matchYear = filter.year ? s.year === parseInt(filter.year) : true;
    const matchDiv = filter.division ? s.division === filter.division : true;
    return matchYear && matchDiv;
  });

  const s = {
    page: { display: "flex", height: "100vh", background: "#f1f5f9", overflow: "hidden" },
    main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" },
    body: { flex: 1, overflowY: "auto", padding: "20px" },
    tableCard: { background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" },
    header: { padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
    filterBar: { padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "10px" },
    select: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", outline: "none" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 15px", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", background: "#f8fafc" },
    td: { padding: "12px 15px", fontSize: "13px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
    badge: (year) => ({ padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, background: year === 3 ? "#f0fdf4" : "#eff6ff", color: year === 3 ? "#166534" : "#1e40af" }),
    deleteBtn: { color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: "11px" }
  };

  return (
    <div style={s.page}>
      <Sidebar activePath="/students" />
      <div style={s.main}>
        <Topbar />
        <div style={s.body}>
          <div style={s.tableCard}>
            <div style={s.header}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Student Directory</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Total: {filteredStudents.length} Students</span>
            </div>

            {/* Filters */}
            <div style={s.filterBar}>
              <select style={s.select} onChange={(e) => setFilter({ ...filter, year: e.target.value })}>
                <option value="">All Years</option>
                <option value="1">FYBCA</option>
                <option value="2">SYBCA</option>
                <option value="3">TYBCA</option>
              </select>
              <select style={s.select} onChange={(e) => setFilter({ ...filter, division: e.target.value })}>
                <option value="">All Divisions</option>
                <option value="A">Division A</option>
                <option value="B">Division B</option>
              </select>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Roll No</th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>PR Number</th>
                    <th style={s.th}>Class</th>
                    <th style={s.th}>Phone</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Loading students...</td></tr>
                  ) : filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td style={s.td}><b>{student.rollNumber}</b></td>
                      <td style={s.td}>{student.fullName}</td>
                      <td style={s.td}><code style={{ background: "#f1f5f9", padding: "2px 4px", borderRadius: "4px" }}>{student.prNumber}</code></td>
                      <td style={s.td}>
                        <span style={s.badge(student.year)}>{YEAR_LABEL[student.year]} - {student.division}</span>
                      </td>
                      <td style={s.td}>{student.phoneNumber || "-"}</td>
                      <td style={s.td}>
                        <span style={s.deleteBtn} onClick={() => handleDelete(student.id)}>Delete</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;