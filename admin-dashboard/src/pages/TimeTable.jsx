import React, { useState } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box, Typography, Paper, Stack, Button, Select, MenuItem,
  FormControl, InputLabel, Dialog, DialogContent, DialogActions,
  TextField, Chip, IconButton, Tabs, Tab, Alert,
} from "@mui/material";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

const SUBJECTS_BY_YEAR = {
  FYBCA: [
    "FM (Foundational Mathematics)",
    "CSF (Computer System Fundamentals)",
    "ENV PSY (Environmental Psychology)",
    "DCCE (Digital Content Creation)",
    "DAS (Data Analytics Using Spreadsheets)",
    "E-Waste (E-Waste Management)",
    "YEMM (Youth Empowerment)",
    "MENTORING",
  ],
  SYBCA: [
    "WAD (Web App Development)",
    "AM (Agile Methodologies)",
    "OOC (Object Oriented Concepts)",
    "WEB TECH (Web Technology)",
    "DMF (Digital Marketing Fundamentals)",
    "HINDI",
  ],
  TYBCA: [
    "CS (Cyber Security)",
    "MAD (Mobile App Development)",
    "ML (Machine Learning)",
    "SMM (Social Media Marketing)",
    "PROJECT",
  ],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CLASSES = ["FYBCA", "SYBCA", "TYBCA"];
const DIVISIONS = ["A", "B"];
const ALL_COMBOS = [
  { cls: "FYBCA", div: "A" }, { cls: "FYBCA", div: "B" },
  { cls: "SYBCA", div: "A" }, { cls: "SYBCA", div: "B" },
  { cls: "TYBCA", div: "A" }, { cls: "TYBCA", div: "B" },
];

const DEFAULT_TIME_SLOTS = [
  "08:15 - 09:15",
  "09:15 - 10:15",
  "10:15 - 11:15",
  "11:15 - 11:30",
  "11:30 - 12:30",
  "12:30 - 01:30",
  "01:30 - 02:30",
];

const TYPE_STYLES = {
  Theory:   { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" },
  Lab:      { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  Tutorial: { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
};

function TimetableGrid({ schedule, timeSlots, onCellClick, onDelete, readOnly = false }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box sx={{ minWidth: readOnly ? 700 : 900 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: `${readOnly ? 110 : 150}px repeat(6, 1fr)`, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <Box sx={{ p: readOnly ? 1 : 2, borderRight: "1px solid #e2e8f0" }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1, fontSize: readOnly ? "0.65rem" : undefined }}>Time</Typography>
          </Box>
          {DAYS.map((day) => (
            <Box key={day} sx={{ p: readOnly ? 1 : 2, textAlign: "center", borderRight: "1px solid #f1f5f9" }}>
              <Typography variant="body2" fontWeight={800} color="#0f172a" sx={{ fontSize: readOnly ? "0.72rem" : undefined }}>{readOnly ? day.slice(0, 3) : day}</Typography>
            </Box>
          ))}
        </Box>

        {timeSlots.map((slot, idx) => {
          const isBreak = idx === 3;
          return (
            <Box key={slot} sx={{ display: "grid", gridTemplateColumns: `${readOnly ? 110 : 150}px repeat(6, 1fr)`, borderBottom: "1px solid #f1f5f9", "&:last-child": { borderBottom: "none" } }}>
              <Box sx={{ p: readOnly ? 1 : 2, borderRight: "1px solid #e2e8f0", bgcolor: isBreak ? "#fef9e7" : "#fafafa", display: "flex", alignItems: "center" }}>
                <Typography variant="caption" fontWeight={700} color={isBreak ? "#92400e" : "#64748b"} sx={{ fontSize: "0.65rem", lineHeight: 1.5 }}>{slot}</Typography>
              </Box>
              {DAYS.map((day) => {
                const key = `${day}__${slot}`;
                const entry = schedule[key];
                const style = entry ? TYPE_STYLES[entry.type] : null;
                return (
                  <Box key={`${day}-${slot}`}
                    onClick={() => !readOnly && !isBreak && !entry && onCellClick && onCellClick(day, slot, idx)}
                    sx={{
                      p: 1, borderRight: "1px solid #f1f5f9",
                      minHeight: isBreak ? (readOnly ? 32 : 48) : (readOnly ? 60 : 95),
                      bgcolor: isBreak ? "#fef9e7" : "transparent",
                      cursor: !readOnly && !isBreak && !entry ? "pointer" : "default",
                      "&:hover": !readOnly && !isBreak && !entry ? { bgcolor: `${TEAL}08` } : {},
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                    {isBreak ? (
                      <Typography variant="caption" fontWeight={700} color="#92400e" sx={{ fontSize: "0.65rem" }}>☕ Break</Typography>
                    ) : entry ? (
                      <Box sx={{ width: "100%", bgcolor: style.bg, borderRadius: 2, p: 1, borderLeft: `3px solid ${style.color}`, position: "relative", "&:hover .del-btn": { opacity: 1 } }}>
                        {!readOnly && (
                          <IconButton size="small" className="del-btn"
                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(day, slot); }}
                            sx={{ position: "absolute", top: 1, right: 1, opacity: 0, width: 16, height: 16, transition: "opacity 0.2s", "&:hover": { color: "#ef4444" } }}>
                            <CloseRoundedIcon sx={{ fontSize: 11 }} />
                          </IconButton>
                        )}
                        <Typography variant="caption" fontWeight={800} color={style.color} display="block" sx={{ pr: readOnly ? 0 : 2, lineHeight: 1.3, fontSize: "0.65rem" }}>
                          {entry.subject}
                        </Typography>
                        {entry.teacher && <Typography variant="caption" sx={{ display: "block", mt: 0.2, fontSize: "0.6rem", color: style.color, opacity: 0.75 }}>{entry.teacher}</Typography>}
                        {entry.room && <Typography variant="caption" sx={{ display: "block", fontSize: "0.6rem", color: style.color, opacity: 0.65 }}>📍 {entry.room}</Typography>}
                      </Box>
                    ) : (
                      !readOnly && <AddRoundedIcon sx={{ fontSize: 18, color: "#e2e8f0" }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default function TimeTable() {
  const [allData, setAllData] = useState({});
  const [currentClass, setCurrentClass] = useState("FYBCA");
  const [currentDiv, setCurrentDiv] = useState("A");
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const [form, setForm] = useState({ subject: "", type: "Theory", teacher: "", room: "" });
  const [printOpen, setPrintOpen] = useState(false);
  const [printClass, setPrintClass] = useState("FYBCA");
  const [printDiv, setPrintDiv] = useState("A");
  const [printAll, setPrintAll] = useState(false);
  const [timeSlots, setTimeSlots] = useState(DEFAULT_TIME_SLOTS);
  const [editSlotOpen, setEditSlotOpen] = useState(false);
  const [editingSlotIdx, setEditingSlotIdx] = useState(null);
  const [editingSlotValue, setEditingSlotValue] = useState("");

  const classKey = `${currentClass}-${currentDiv}`;
  const schedule = allData[classKey] || {};
  const subjects = SUBJECTS_BY_YEAR[currentClass] || [];

  const handleCellClick = (day, slot, idx) => {
    if (idx === 3) return;
    setActiveDay(day);
    setActiveSlot(slot);
    setForm({ subject: "", type: "Theory", teacher: "", room: "" });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.subject) return;
    const key = `${activeDay}__${activeSlot}`;
    setAllData((prev) => ({
      ...prev,
      [classKey]: { ...schedule, [key]: { ...form, id: Date.now() } },
    }));
    setModalOpen(false);
  };

  const handleDelete = (day, slot) => {
    const key = `${day}__${slot}`;
    const updated = { ...schedule };
    delete updated[key];
    setAllData((prev) => ({ ...prev, [classKey]: updated }));
  };

  const handleExport = () => {
    const rows = [];
    timeSlots.forEach((slot) => {
      DAYS.forEach((day) => {
        const entry = schedule[`${day}__${slot}`];
        if (entry) rows.push({ Day: day, Time: slot, Subject: entry.subject, Type: entry.type, Teacher: entry.teacher, Room: entry.room });
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, `${classKey}_Timetable.xlsx`);
  };

  const openEditSlot = (idx) => {
    setEditingSlotIdx(idx);
    setEditingSlotValue(timeSlots[idx]);
    setEditSlotOpen(true);
  };

  const saveSlotEdit = () => {
    const updated = [...timeSlots];
    updated[editingSlotIdx] = editingSlotValue;
    setTimeSlots(updated);
    setEditSlotOpen(false);
  };

  const generateSingleHTML = (cls, div, sched) => {
    const rows = timeSlots.map((slot, idx) => {
      const isBreak = idx === 3;
      const cells = DAYS.map((day) => {
        if (isBreak) return `<td style="background:#fef9e7;text-align:center;font-weight:700;color:#92400e;padding:8px;">☕ Break</td>`;
        const entry = sched[`${day}__${slot}`];
        if (!entry) return `<td style="color:#cbd5e1;text-align:center;font-size:11px;padding:8px;">—</td>`;
        const style = TYPE_STYLES[entry.type];
        return `<td style="background:${style.bg};padding:8px;border-left:3px solid ${style.color};">
          <div style="font-weight:700;color:${style.color};font-size:11px;">${entry.subject}</div>
          ${entry.teacher ? `<div style="font-size:10px;color:#64748b;margin-top:2px;">${entry.teacher}</div>` : ""}
          ${entry.room ? `<div style="font-size:10px;color:#94a3b8;margin-top:2px;">📍 ${entry.room}</div>` : ""}
        </td>`;
      }).join("");
      return `<tr><td style="font-weight:700;font-size:11px;color:#475569;background:#f8fafc;padding:8px;white-space:nowrap;border:1px solid #e2e8f0;">${slot}</td>${cells}</tr>`;
    }).join("");

    return `<div style="margin-bottom:40px;page-break-after:always;">
      <h2 style="color:#064e3b;margin-bottom:4px;font-size:18px;">${cls} — Division ${div}</h2>
      <p style="color:#64748b;font-size:12px;margin-bottom:16px;">Academic Year 2025–26 (Even Semester)</p>
      <table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e2e8f0;">
        <thead><tr>
          <th style="background:#064e3b;color:white;padding:10px;text-align:center;border:1px solid #e2e8f0;">Time</th>
          ${DAYS.map((d) => `<th style="background:#064e3b;color:white;padding:10px;text-align:center;border:1px solid #e2e8f0;">${d}</th>`).join("")}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    let body = "";
    if (printAll) {
      body = ALL_COMBOS.map(({ cls, div }) => generateSingleHTML(cls, div, allData[`${cls}-${div}`] || {})).join("");
    } else {
      body = generateSingleHTML(printClass, printDiv, allData[`${printClass}-${printDiv}`] || {});
    }
    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>BCA Timetable</title>
      <style>body{font-family:Arial,sans-serif;padding:20px;margin:0;}@media print{body{padding:10px;}}</style>
      </head><body>${body}<p style="font-size:10px;color:#94a3b8;margin-top:20px;">Generated from BCA Portal • ${new Date().toLocaleDateString()}</p></body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      <Sidebar activePath="/timetable" />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title="Timetable Manager" subtitle="Even Semester 2025–26" />
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>

          {/* Controls */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Class</InputLabel>
                  <Select value={currentClass} label="Class" onChange={(e) => setCurrentClass(e.target.value)} sx={{ borderRadius: 2 }}>
                    {CLASSES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Division</InputLabel>
                  <Select value={currentDiv} label="Division" onChange={(e) => setCurrentDiv(e.target.value)} sx={{ borderRadius: 2 }}>
                    {DIVISIONS.map((d) => <MenuItem key={d} value={d}>Division {d}</MenuItem>)}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Button variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={handleExport}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                  Export
                </Button>
                <Button variant="outlined" startIcon={<PrintRoundedIcon />} onClick={() => setPrintOpen(true)}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                  Print
                </Button>
                <Button variant="outlined" startIcon={<RefreshRoundedIcon />}
                  onClick={() => setAllData((p) => ({ ...p, [classKey]: {} }))}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Tabs */}
          <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden" }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
              sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 48 }, "& .Mui-selected": { color: TEAL }, "& .MuiTabs-indicator": { bgcolor: TEAL } }}>
              <Tab icon={<ScheduleRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Edit Timetable" />
              <Tab icon={<GridViewRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="View All" />
            </Tabs>
          </Paper>

          {/* TAB 0: EDIT */}
          {activeTab === 0 && (
            <>
              <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
                  <Typography variant="body2" fontWeight={700} color="#475569">⏱ Time Slots:</Typography>
                  {timeSlots.map((slot, idx) => (
                    <Chip key={idx} label={slot} onClick={() => openEditSlot(idx)}
                      icon={<EditRoundedIcon style={{ fontSize: 13 }} />} size="small"
                      sx={{
                        bgcolor: idx === 3 ? "#fef9e7" : "#f1f5f9", color: idx === 3 ? "#92400e" : "#475569",
                        fontWeight: 600, cursor: "pointer", border: idx === 3 ? "1px solid #fde68a" : "1px solid #e2e8f0",
                        "&:hover": { bgcolor: idx === 3 ? "#fef3c7" : "#e2e8f0" },
                      }} />
                  ))}
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden" }}>
                <Box sx={{ p: 2.5, borderBottom: "1px solid #f1f5f9" }}>
                  <Typography fontWeight={800} color="#0f172a">{currentClass} — Division {currentDiv}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Click any empty cell to add a session</Typography>
                </Box>
                <TimetableGrid schedule={schedule} timeSlots={timeSlots} onCellClick={handleCellClick} onDelete={handleDelete} />
              </Paper>
            </>
          )}

          {/* TAB 1: VIEW ALL */}
          {activeTab === 1 && (
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a">All Timetables</Typography>
                  <Typography variant="body2" color="text.secondary">All 6 divisions</Typography>
                </Box>
                <Button variant="contained" startIcon={<PrintRoundedIcon />}
                  onClick={() => { setPrintAll(true); setPrintOpen(true); }}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, boxShadow: "none" }}>
                  Print All
                </Button>
              </Stack>

              {ALL_COMBOS.map(({ cls, div }) => {
                const key = `${cls}-${div}`;
                const sched = allData[key] || {};
                return (
                  <Paper key={key} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden" }}>
                    <Box sx={{ p: 2.5, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography fontWeight={800} color="#0f172a">{cls} — Division {div}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                          {Object.keys(sched).length} session{Object.keys(sched).length !== 1 ? "s" : ""} added
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" startIcon={<EditRoundedIcon sx={{ fontSize: 14 }} />}
                          onClick={() => { setCurrentClass(cls); setCurrentDiv(div); setActiveTab(0); }}
                          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, fontSize: "0.78rem", borderColor: TEAL, color: TEAL }}>
                          Edit
                        </Button>
                      </Stack>
                    </Box>
                    <TimetableGrid schedule={sched} timeSlots={timeSlots} readOnly />
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Add Session Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={800} color="white">Add Session</Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", mt: 0.3 }}>{activeDay} • {activeSlot}</Typography>
            </Box>
            <IconButton onClick={() => setModalOpen(false)} sx={{ color: "rgba(255,255,255,0.7)" }}><CloseRoundedIcon /></IconButton>
          </Stack>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Subject</InputLabel>
              <Select value={form.subject} label="Subject" onChange={(e) => setForm({ ...form, subject: e.target.value })} sx={{ borderRadius: 2 }}>
                {subjects.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1.5}>
              {["Theory", "Lab", "Tutorial"].map((t) => (
                <Button key={t} onClick={() => setForm({ ...form, type: t })} size="small"
                  variant={form.type === t ? "contained" : "outlined"}
                  sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 700,
                    ...(form.type === t
                      ? { bgcolor: "#0f172a", color: "white" }
                      : { borderColor: "#e2e8f0", color: "#475569" }) }}>
                  {t}
                </Button>
              ))}
            </Stack>
            <TextField fullWidth size="small" label="Teacher Name" value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              InputProps={{ sx: { borderRadius: 2 } }} />
            <TextField fullWidth size="small" label="Room / Lab" value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              InputProps={{ sx: { borderRadius: 2 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 600, border: "1px solid #e2e8f0", color: "#475569" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.subject}
            sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, boxShadow: "none" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Time Slot Modal */}
      <Dialog open={editSlotOpen} onClose={() => setEditSlotOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Typography variant="h6" fontWeight={800} color="white">Edit Time Slot</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", mt: 0.3 }}>
            {editingSlotIdx === 3 ? "☕ Break slot" : `Slot ${(editingSlotIdx ?? 0) + 1}`}
          </Typography>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <TextField fullWidth label="Time" value={editingSlotValue}
            onChange={(e) => setEditingSlotValue(e.target.value)}
            helperText="Format: HH:MM - HH:MM"
            InputProps={{ sx: { borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button onClick={() => setEditSlotOpen(false)} sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 600, border: "1px solid #e2e8f0", color: "#475569" }}>Cancel</Button>
          <Button variant="contained" onClick={saveSlotEdit}
            sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, boxShadow: "none" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Modal */}
      <Dialog open={printOpen} onClose={() => { setPrintOpen(false); setPrintAll(false); }} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={800} color="white">Print Timetable</Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", mt: 0.3 }}>
                {printAll ? "All 6 timetables" : "Select class & division"}
              </Typography>
            </Box>
            <IconButton onClick={() => { setPrintOpen(false); setPrintAll(false); }} sx={{ color: "rgba(255,255,255,0.7)" }}><CloseRoundedIcon /></IconButton>
          </Stack>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            {!printAll && (
              <>
                <FormControl fullWidth size="small">
                  <InputLabel>Class</InputLabel>
                  <Select value={printClass} label="Class" onChange={(e) => setPrintClass(e.target.value)} sx={{ borderRadius: 2 }}>
                    {CLASSES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Division</InputLabel>
                  <Select value={printDiv} label="Division" onChange={(e) => setPrintDiv(e.target.value)} sx={{ borderRadius: 2 }}>
                    {DIVISIONS.map((d) => <MenuItem key={d} value={d}>Division {d}</MenuItem>)}
                  </Select>
                </FormControl>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button onClick={() => { setPrintOpen(false); setPrintAll(false); }} sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 600, border: "1px solid #e2e8f0", color: "#475569" }}>Cancel</Button>
          <Button variant="contained" startIcon={<PrintRoundedIcon />} onClick={handlePrint}
            sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, boxShadow: "none" }}>
            Print / PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}