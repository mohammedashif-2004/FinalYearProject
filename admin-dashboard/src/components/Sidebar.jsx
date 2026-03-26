import { useNavigate } from "react-router-dom";

const LINKS = [
  { label: "Dashboard", path: "/dashboard", section: "Main", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { label: "Attendance", path: "/attendance", icon: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z", pill: "Today", pillColor: "teal" },
  { label: "Notices", path: "/notices", icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z", pill: "3", pillColor: "red" },
  { label: "Results", path: "/results", icon: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" },
  { label: "Timetable", path: "/timetable", icon: "M3 3h18v2H3zm0 8h18v2H3zm0 8h18v2H3z" },
  { label: "Calendar", path: "/calendar", section: "More", icon: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" },
  { label: "Profile", path: "/profile", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" },
  { label: "Analytics", path: "/reports", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" },
];

export default function Sidebar({ activePath }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "SUPER_ADMIN";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ width: 320, background: "#0f172a", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}>
      
      {/* Logo */}
      <div style={{ padding: "18px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ width: 36, height: 36, background: "#0d9488", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
        </div>
        <div>
          <div style={{ color: "white", fontSize: 14, fontWeight: 700 }}>BCA Portal</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 2 }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {LINKS.map((link) => {
          const active = activePath === link.path;
          return (
            <div key={link.path}>
              {link.section && (
                <div style={{ padding: "14px 16px 4px", fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "1.4px", fontWeight: 700 }}>
                  {link.section}
                </div>
              )}
              <div
                onClick={() => navigate(link.path)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", margin: "2px 10px", borderRadius: 8, color: active ? "white" : "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", fontWeight: 500, background: active ? "#0d9488" : "transparent", transition: "all 0.15s" }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={link.icon}/></svg>
                <span style={{ flex: 1 }}>{link.label}</span>
                {link.pill && (
                  <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: link.pillColor === "teal" ? "rgba(13,148,136,0.3)" : "rgba(239,68,68,0.25)", color: link.pillColor === "teal" ? "#5eead4" : "#fca5a5" }}>
                    {link.pill}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Footer */}
      <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 36, height: 36, background: "#0d9488", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{username}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{role.replace(/_/g, " ")}</div>
          </div>
          <svg style={{ marginLeft: "auto", fill: "rgba(255,255,255,0.4)", flexShrink: 0, width: "16", height: "16" }} viewBox="0 0 24 24">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}