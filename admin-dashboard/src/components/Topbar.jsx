export default function Topbar({ title, subtitle }) {
  const username = localStorage.getItem("username") || "Admin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ background: "white", padding: "11px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{title || `${greeting}, ${username} 👋`}</div>
        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>{subtitle || "Academic Year 2025–26 · Semester II"}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 10, color: "#64748b", background: "#f8fafc", padding: "4px 9px", borderRadius: 6, border: "1px solid #e2e8f0", fontWeight: 500 }}>{today}</div>
        <div style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#64748b"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#64748b"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <div style={{ position: "absolute", top: 4, right: 4, width: 5, height: 5, background: "#ef4444", borderRadius: "50%", border: "1.5px solid white" }}/>
        </div>
      </div>
    </div>
  );
}