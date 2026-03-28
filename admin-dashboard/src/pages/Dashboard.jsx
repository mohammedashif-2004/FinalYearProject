import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";
import BulkStudentUpload from "../components/BulkStudentUpload";
const CARDS = [
  { label: "Students", key: "totalStudents", sub: "Active enrolled", color: "#0d9488", bg: "linear-gradient(135deg,#0d9488,#0f766e)", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
  { label: "Teachers", key: "totalTeachers", sub: "All active", color: "#3b82f6", bg: "linear-gradient(135deg,#3b82f6,#1d4ed8)", icon: "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" },
  { label: "Avg Attendance", key: "avgAttendance", sub: "Overall this month", color: "#10b981", bg: "linear-gradient(135deg,#10b981,#059669)", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z", suffix: "%" },
  { label: "Low Attendance", key: "lowAttendance", sub: "Students below 75%", color: "#f59e0b", bg: "linear-gradient(135deg,#f59e0b,#d97706)", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
];

const YEAR_LABEL = { 1: "FYBCA", 2: "SYBCA", 3: "TYBCA" };

export default function Dashboard() {
  // Added recentActivity array to the default state to prevent mapping errors before data loads
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


  const handleResetDatabase = async () => {
    const confirmClear = window.confirm("⚠️ DANGER: This will permanently delete ALL students and their login accounts. Admins/Teachers will NOT be affected. Proceed?");
    
    if (confirmClear) {
        try {
            await api.delete("/api/admin/students/all");
            alert("Database Cleared! You can now perform a fresh upload.");
            window.location.reload(); // Refresh to update counts to 0
        } catch (err) {
            console.error(err);
            alert("Reset failed. Check if you have Admin permissions.");
        }
    }
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
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={s.cardTop(card.bg)}>
                  <div style={s.cardIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d={card.icon}/></svg>
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

          <div style={{ 
    background: "white", 
    borderRadius: 10, 
    border: "1px solid #e2e8f0", 
    padding: "16px",
    marginBottom: "12px" 
}}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Bulk Onboarding</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Upload Excel to add students to FY, SY, or TY</div>
        </div>

        <button 
    onClick={handleResetDatabase}
    style={{ 
        fontSize: '10px', 
        color: '#ef4444', 
        fontWeight: 600, 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer',
        marginRight: '15px'
    }}
>
    Reset Student DB ↺
</button>
        {/* Optional: Add a "Download Template" link here */}
        <a href="/student_template.xlsx" style={{ fontSize: 15, color: "#0d9488", fontWeight: 600 }}>Download Template ↓</a>
    </div>
    <BulkStudentUpload />
</div>

          {/* Bottom Row */}
          <div style={s.bottom}>

            {/* Division Attendance */}
            <div style={s.panel}>
              <div style={s.ph}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Division-wise Attendance</div>
                <div style={{ fontSize: 10, color: "#0d9488", fontWeight: 600, cursor: "pointer" }}>View all →</div>
              </div>
              <div style={{ padding: "5px 14px 10px", overflowY: "auto" }}>
                {loading ? (
                  <div style={{ padding: 14, color: "#94a3b8", fontSize: 12 }}>Loading actual data...</div>
                ) : stats.divisions?.length > 0 ? (
                  stats.divisions.map((d, i) => {
                    // Pulling the real percentage from the backend response
                    const pct = d.attendancePercentage || 0; 
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderBottom: i < stats.divisions.length - 1 ? "1px solid #f8fafc" : "none" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#334155", width: 78, flexShrink: 0 }}>{YEAR_LABEL[d.year]} – {d.division}</div>
                        <div style={{ flex: 1, height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 3, background: pct < 75 ? "#ef4444" : "#0d9488", width: `${pct}%` }}/>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, minWidth: 33, textAlign: "right", color: pct < 75 ? "#ef4444" : "#0d9488" }}>{pct}%</div>
                      </div>
                    );
                  })
                ) : (
                   <div style={{ padding: 14, color: "#94a3b8", fontSize: 12 }}>No attendance data recorded yet.</div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={s.panel}>
              <div style={s.ph}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Recent Activity</div>
                <div style={{ fontSize: 10, color: "#0d9488", fontWeight: 600, cursor: "pointer" }}>View all →</div>
              </div>
              <div style={{ padding: "5px 14px 8px", overflowY: "auto" }}>
                {loading ? (
                   <div style={{ padding: 14, color: "#94a3b8", fontSize: 12 }}>Loading activity stream...</div>
                ) : stats.recentActivity?.length > 0 ? (
                  stats.recentActivity.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, padding: "7px 0", borderBottom: i < stats.recentActivity.length - 1 ? "1px solid #f8fafc" : "none", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, paddingTop: 3 }}>
                        {/* Assuming the backend sends a 'color' property, otherwise defaulting to Teal */}
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color || "#0d9488", flexShrink: 0 }}/>
                        {i < stats.recentActivity.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 10, background: "#f1f5f9" }}/>}
                      </div>
                      <div>
                        {/* Assuming backend sends 'title', 'timeAgo', 'badgeText', and 'badgeColor' */}
                        <div style={{ fontSize: 11, color: "#334155", fontWeight: 500 }}>{a.title}</div>
                        <div style={{ fontSize: 9.5, color: "#94a3b8", marginTop: 1 }}>{a.timeAgo}</div>
                        {a.badgeText && (
                           <span style={{ display: "inline-block", fontSize: 8.5, padding: "2px 7px", borderRadius: 20, fontWeight: 600, marginTop: 2, background: `${a.color || '#0d9488'}15`, color: a.color || "#0d9488" }}>{a.badgeText}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 14, color: "#94a3b8", fontSize: 12 }}>No recent activity.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}