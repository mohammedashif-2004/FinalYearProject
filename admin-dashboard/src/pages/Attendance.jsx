import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box, Typography, Select, MenuItem, TextField, Table, TableBody,
  TableCell, TableHead, TableRow, Paper, Button, Chip,
  FormControl, InputLabel, Stack, Dialog, DialogContent, DialogActions,
  LinearProgress, IconButton, Alert, CircularProgress, Avatar,
} from "@mui/material";
import * as XLSX from "xlsx";
import api from "../services/api";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

const yearMap = { FYBCA: 1, SYBCA: 2, TYBCA: 3 };
const TEAL = "#0d9488";

const getStatusChip = (status) => {
  if (status === true) return { label: "Present", bgcolor: "#dcfce7", color: "#166534" };
  if (status === false) return { label: "Absent", bgcolor: "#fee2e2", color: "#991b1b" };
  if (status === "DL") return { label: "Duty Leave", bgcolor: "#fef9c3", color: "#854d0e" };
  return null;
};

export default function Attendance() {
  const [year, setYear] = useState(1);
  const [division, setDivision] = useState("A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [markingOpen, setMarkingOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [markingDone, setMarkingDone] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  // --- UPDATED EFFECT: Triggers whenever Year, Div, or Date changes ---
  useEffect(() => {
    loadDashboardData();
  }, [year, division, selectedDate]);

  // --- UPDATED LOGIC: Combined Fetching ---
  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // 1. Fetch Students
      const studentRes = await api.get("/api/admin/students/attendance-list", {
        params: { year, division }
      });
      setStudents(studentRes.data);

      // 2. Fetch Existing Attendance for this Date
      const checkRes = await api.get("/api/teacher/attendance/check", {
        params: { year, division, date: selectedDate } // selectedDate must be "2026-03-28"
      });

      if (checkRes.data && Object.keys(checkRes.data).length > 0) {
        setAttendance(checkRes.data);
        setMarkingDone(true); // If data exists, show it immediately
      } else {
        setAttendance({});
        setMarkingDone(false); // If no data, allow fresh marking
      }

    } catch (err) {
      console.error("Load Error:", err);
      setError("Error loading data. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const currentStudent = students[currentIndex];
  const totalStudents = students.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalStudents - 1;
  const markedCount = Object.keys(attendance).length;
  const presentCount = Object.values(attendance).filter((v) => v === true).length;
  const absentCount = Object.values(attendance).filter((v) => v === false).length;
  const dutyLeaveCount = Object.values(attendance).filter((v) => v === "DL").length;

  const markAttendance = (status) => {
    if (!currentStudent) return;
    setAttendance((prev) => ({ ...prev, [currentStudent.rollNumber]: status }));
    if (isLast) {
      setMarkingOpen(false);
      setMarkingDone(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRowClick = (student) => {
    if (!markingDone && markedCount === 0) return;
    setEditStudent(student);
  };

  const saveEditStudent = (status) => {
    if (!editStudent) return;
    setAttendance((prev) => ({ ...prev, [editStudent.rollNumber]: status }));
    setEditStudent(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const payload = {
        year: year,
        division: division,
        date: selectedDate,
        attendance: attendance // Sending the attendance state directly
      };

      const response = await api.post("/api/teacher/attendance/save", payload);
      setSuccess("✅ Attendance saved successfully!");
      setMarkingDone(true);
    } catch (err) {
      setError("❌ Failed to save: " + (err.response?.data || "Server Error"));
    } finally {
      setSaving(false);
    }
  };

  const downloadReport = () => {
    if (markedCount === 0) { alert("No attendance marked!"); return; }
    const data = students.map((s) => {
      const val = attendance[s.rollNumber];
      return {
        "Roll No": s.rollNumber,
        "Student Name": s.fullName,
        "PR Number": s.prNumber,
        "Status": val === true ? "Present" : val === false ? "Absent" : val === "DL" ? "Duty Leave" : "Not Marked",
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${year}_${division}_${selectedDate}.xlsx`);
  };

  const progress = totalStudents > 0 ? ((currentIndex + 1) / totalStudents) * 100 : 0;

  const MarkButtons = ({ rollKey, onMark }) => {
    const current = attendance[rollKey];
    return (
      <Stack direction="row" spacing={2} justifyContent="center" mt={4} flexWrap="wrap">
        <Button variant={current === true ? "contained" : "outlined"}
          startIcon={<CheckCircleRoundedIcon />}
          onClick={() => onMark(true)} size="large"
          sx={{
            minWidth: 140, py: 1.6, borderRadius: 3, fontWeight: 700, textTransform: "none",
            ...(current === true
              ? { bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" }, borderColor: "#10b981", color: "white" }
              : { color: "#10b981", borderColor: "#10b981", "&:hover": { bgcolor: "#f0fdf4" } })
          }}>
          Present
        </Button>
        <Button variant={current === false ? "contained" : "outlined"}
          startIcon={<CancelRoundedIcon />}
          onClick={() => onMark(false)} size="large"
          sx={{
            minWidth: 140, py: 1.6, borderRadius: 3, fontWeight: 700, textTransform: "none",
            ...(current === false
              ? { bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, borderColor: "#ef4444", color: "white" }
              : { color: "#ef4444", borderColor: "#ef4444", "&:hover": { bgcolor: "#fef2f2" } })
          }}>
          Absent
        </Button>
        <Button variant={current === "DL" ? "contained" : "outlined"}
          startIcon={<BadgeRoundedIcon />}
          onClick={() => onMark("DL")} size="large"
          sx={{
            minWidth: 140, py: 1.6, borderRadius: 3, fontWeight: 700, textTransform: "none",
            ...(current === "DL"
              ? { bgcolor: "#eab308", "&:hover": { bgcolor: "#ca8a04" }, borderColor: "#eab308", color: "white" }
              : { color: "#ca8a04", borderColor: "#eab308", "&:hover": { bgcolor: "#fefce8" } })
          }}>
          Duty Leave
        </Button>
      </Stack>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      <Sidebar activePath="/attendance" />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title="Mark Attendance" subtitle={`${year} • Division ${division}`} />
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{success}</Alert>}

          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  label="Year"
                >
                  <MenuItem value={1}>FYBCA</MenuItem>
                  <MenuItem value={2}>SYBCA</MenuItem>
                  <MenuItem value={3}>TYBCA</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Division</InputLabel>
                <Select value={division} label="Division" onChange={(e) => setDivision(e.target.value)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="A">Division A</MenuItem>
                  <MenuItem value="B">Division B</MenuItem>
                </Select>
              </FormControl>
              <TextField type="date" size="small" value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ width: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              <Stack direction="row" spacing={1.5} ml="auto">
                <Button variant="outlined" startIcon={<DownloadRoundedIcon />}
                  onClick={downloadReport} disabled={markedCount === 0}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
                  Export
                </Button>
                {!markingDone ? (
                  <Button variant="contained" startIcon={loading ? null : <PlayArrowRoundedIcon />}
                    onClick={() => { setCurrentIndex(0); setMarkingOpen(true); }}
                    disabled={loading || totalStudents === 0}
                    sx={{ bgcolor: TEAL, borderRadius: 2.5, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#0f766e" } }}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Start"}
                  </Button>
                ) : (
                  <Button variant="contained" startIcon={<SaveRoundedIcon />}
                    onClick={handleSave} disabled={saving}
                    sx={{ bgcolor: "#10b981", borderRadius: 2.5, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#059669" } }}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Update"}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>

          {/* Rest of your UI components (Stats and Table) stay exactly the same */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
            {[
              { label: "Total", value: totalStudents, color: TEAL },
              { label: "Present", value: presentCount, color: "#10b981" },
              { label: "Absent", value: absentCount, color: "#ef4444" },
              { label: "Duty Leave", value: dutyLeaveCount, color: "#eab308" },
            ].map((stat) => (
              <Paper key={stat.label} elevation={0} sx={{ flex: 1, p: 2, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</Typography>
                <Typography variant="h5" fontWeight={900} color={stat.color}>{stat.value}</Typography>
              </Paper>
            ))}
          </Stack>

          <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #e2e8f0", bgcolor: "white" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
              <Typography fontWeight={800} color="#0f172a">Attendance Record</Typography>
            </Box>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  {["Roll No", "Student Name", "PR Number", "Status"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                  const status = attendance[student.rollNumber];
                  const chip = getStatusChip(status);
                  return (
                    <TableRow key={student.prNumber} hover onClick={() => handleRowClick(student)}
                      sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f0fdf4" } }}>
                      <TableCell sx={{ fontWeight: 700 }}>{student.rollNumber}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell sx={{ color: "#64748b" }}>{student.prNumber}</TableCell>
                      <TableCell>
                        {chip ? (
                          <Chip label={chip.label} size="small"
                            sx={{ bgcolor: chip.bgcolor, color: chip.color, fontWeight: 700 }} />
                        ) : <Typography variant="body2" color="#cbd5e1">—</Typography>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>

      {/* Dialogs for Marking and Editing stay the same */}
      <Dialog open={markingOpen} onClose={() => setMarkingOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, #0f766e)`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={800} color="white">Mark Attendance</Typography>
            <IconButton onClick={() => setMarkingOpen(false)} sx={{ color: "rgba(255,255,255,0.7)" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <LinearProgress variant="determinate" value={progress}
            sx={{ mt: 2, height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.2)", "& .MuiLinearProgress-bar": { bgcolor: "white" } }} />
        </Box>
        <DialogContent sx={{ p: 4 }}>
          {currentStudent && (
            <Box textAlign="center">
              <Avatar sx={{ width: 72, height: 72, bgcolor: `${TEAL}20`, color: TEAL, fontSize: "1.8rem", fontWeight: 900, mx: "auto", mb: 2, borderRadius: 3 }}>
                {currentStudent.fullName?.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight={800} color="#0f172a">{currentStudent.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">Roll: {currentStudent.rollNumber}</Typography>
              <MarkButtons rollKey={currentStudent.rollNumber} onMark={markAttendance} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button onClick={() => { if (!isFirst) setCurrentIndex((p) => p - 1); }} disabled={isFirst}
            sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", border: "1px solid #e2e8f0" }}>
            Previous
          </Button>
          <Button variant="contained"
            onClick={() => isLast ? setMarkingOpen(false) : setCurrentIndex((p) => p + 1)}
            sx={{ flex: 1, bgcolor: TEAL, borderRadius: 2.5, textTransform: "none", fontWeight: 700 }}>
            {isLast ? "Done" : "Next"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editStudent} onClose={() => setEditStudent(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, #0f766e)`, p: 3 }}>
          <Typography variant="h6" fontWeight={800} color="white">Edit Student</Typography>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          {editStudent && (
            <Box textAlign="center">
              <Avatar sx={{ width: 64, height: 64, bgcolor: `${TEAL}20`, color: TEAL, fontSize: "1.6rem", fontWeight: 900, mx: "auto", mb: 2, borderRadius: 3 }}>
                {editStudent.fullName?.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight={800}>{editStudent.fullName}</Typography>
              <MarkButtons rollKey={editStudent.rollNumber} onMark={saveEditStudent} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}