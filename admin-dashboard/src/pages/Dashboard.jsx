import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";
import BulkStudentUpload from "../components/BulkStudentUpload";
import { Box, Typography } from "@mui/material";

const CARDS = [
  { label: "Students", key: "totalStudents", sub: "View Directory", color: "#0d9488", bg: "linear-gradient(135deg,#0d9488,#0f766e)", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
  { label: "Teachers", key: "totalTeachers", sub: "All active", color: "#3b82f6", bg: "linear-gradient(135deg,#3b82f6,#1d4ed8)", icon: "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" },
  { label: "Avg Attendance", key: "avgAttendance", sub: "Overall this month", color: "#10b981", bg: "linear-gradient(135deg,#10b981,#059669)", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z", suffix: "%" },
  { label: "Low Attendance", key: "lowAttendance", sub: "Below 75%", color: "#f59e0b", bg: "linear-gradient(135deg,#f59e0b,#d97706)", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
];

const YEAR_LABEL = { 1: "FYBCA", 2: "SYBCA", 3: "TYBCA" };

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    avgAttendance: 0,
    lowAttendance: 0,
    divisions: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard/stats")
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch dashboard stats", error);
        setLoading(false);
      });
  }, []);

  const handleDivisionClick = (yearValue, divLabel) => {
    navigate(`/attendance-summary?year=${yearValue}&division=${divLabel}`);
  };

  const handleStudentCardClick = () => {
    // Navigate to directory (defaulting to FY-A)
    navigate(`/admin/students?year=1&division=A`);
  };

  const s = {
    page: { display: "flex", height: "100vh", background: "#f1f5f9", overflow: "hidden" },
    main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" },
    body: { flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 },
    cardsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 },
    card: { background: "white", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s" },
    cardTop: (bg) => ({ height: 70, display: "flex", alignItems: "center", justifyContent: "center", background: bg }),
    cardIcon: { width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" },
    cardBody: { padding: "10px 12px 12px" },
    bottom: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12, flex: 1, minHeight: 0 },
    panel: { background: "white", borderRadius: 10, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden" },
    ph: { padding: "12px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 },
  };

  return (
    <div style={s.page}>
      <Sidebar activePath="/dashboard" studentCount={stats.totalStudents} />
      <div style={s.main}>
        <Topbar />
        <div style={s.body}>

          {/* Stat Cards */}
          <div style={s.cardsGrid}>
            {CARDS.map((card) => (
              <div key={card.label} style={s.card}
                onClick={() => card.key === "totalStudents" && handleStudentCardClick()}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={s.cardTop(card.bg)}>
                  <div style={s.cardIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d={card.icon} /></svg>
                  </div>
                </div>
                <div style={s.cardBody}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, marginTop: 3 }}>
                    {loading ? "..." : (stats[card.key] ?? 0)}{card.suffix || ""}
                  </div>
                  <div style={{ fontSize: 10, marginTop: 5, paddingTop: 6, borderTop: "1px solid #f1f5f9" }}>
                    <b style={{ color: card.color }}>{card.sub}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Onboarding */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Bulk Onboarding</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Upload Excel to add students</div>
              </div>
              <a href="/student_template.xlsx" style={{ fontSize: 12, color: "#0d9488", fontWeight: 600 }}>Download Template ↓</a>
            </div>
            <BulkStudentUpload />
          </div>

          <div style={s.bottom}>
            {/* Division Attendance Section */}
            <div style={s.panel}>
              <div style={s.ph}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Division-wise Attendance</div>
              </div>
              <div style={{ padding: "5px 14px 10px", overflowY: "auto" }}>
                {loading ? (
                  <div style={{ padding: 14, color: "#94a3b8", fontSize: 12 }}>Loading...</div>
                ) : stats.divisions?.map((d, i) => {
                  const pct = d.attendancePercentage || 0;
                  return (
                    <div
                      key={i}
                      onClick={() => handleDivisionClick(d.year, d.division)}
                      style={{
                        display: "flex", alignItems: "center", gap: 9, padding: "10px 0", cursor: "pointer",
                        borderBottom: i < stats.divisions.length - 1 ? "1px solid #f8fafc" : "none"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#334155", width: 78 }}>
                        {YEAR_LABEL[d.year]} – {d.division}
                      </div>
                      <Box sx={{ flex: 1, height: 6, bgcolor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: pct < 75 ? '#ef4444' : '#0d9488', borderRadius: 3 }} />
                      </Box>
                      <div style={{ fontSize: 11, fontWeight: 700, color: pct < 75 ? "#ef4444" : "#0d9488" }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div style={s.panel}>
              <div style={s.ph}><div style={{ fontSize: 12, fontWeight: 700 }}>Recent Activity</div></div>
              <div style={{ padding: "10px 14px", overflowY: "auto" }}>
                {stats.recentActivity?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, mb: 1, pb: 1, borderBottom: "1px solid #f8fafc" }}>
                     <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color || "#0d9488", mt: 0.5 }} />
                     <div>
                        <div style={{ fontSize: 11, color: "#334155" }}>{a.title}</div>
                        <div style={{ fontSize: 9, color: "#94a3b8" }}>{a.timeAgo}</div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}