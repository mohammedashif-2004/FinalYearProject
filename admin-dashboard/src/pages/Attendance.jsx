import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Typography, Select, MenuItem, TextField, Table, TableBody,
  TableCell, TableHead, TableRow, Container, Paper, Box, Button,
  Chip, FormControl, InputLabel, Stack, Dialog,
  DialogContent, DialogActions, LinearProgress, IconButton, Alert,
  CircularProgress, Avatar,
} from "@mui/material";
import * as XLSX from "xlsx";
import api from "../services/api";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

const yearMap = { FYBCA: 1, SYBCA: 2, TYBCA: 3 };
const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

// attendance values: true = Present, false = Absent, "DL" = Duty Leave
const getStatusChip = (status) => {
  if (status === true)  return { label: "Present",     bgcolor: "#dcfce7", color: "#166534" };
  if (status === false) return { label: "Absent",      bgcolor: "#fee2e2", color: "#991b1b" };
  if (status === "DL")  return { label: "Duty Leave",  bgcolor: "#fef9c3", color: "#854d0e" };
  return null;
};

export default function Attendance() {
  const [year, setYear] = useState("FYBCA");
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

  // Single student edit modal
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => { fetchStudents(); }, [year, division]);
  useEffect(() => { setMarkingDone(false); setAttendance({}); }, [year, division, selectedDate]);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    setAttendance({});
    setMarkingDone(false);
    try {
      const response = await api.get(`/api/admin/students/division?year=${yearMap[year]}&division=${division}`);
      setStudents(response.data);
    } catch {
      setError("Failed to load students. Make sure backend is running.");
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

  // Edit single student from table row click
  const handleRowClick = (student) => {
    if (!markingDone && markedCount === 0) return;
    setEditStudent(student);
  };

  const saveEditStudent = (status) => {
    if (!editStudent) return;
    setAttendance((prev) => ({ ...prev, [editStudent.rollNumber]: status }));
    setEditStudent(null);
  };

  const saveRecords = async () => {
    if (markedCount === 0) { alert("No attendance to save."); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/teacher/attendance", {
        year: yearMap[year], division, date: selectedDate, attendance,
      });
      setSuccess(`Saved! ${presentCount} present, ${absentCount} absent, ${dutyLeaveCount} duty leave.`);
    } catch {
      setError("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const downloadReport = () => {
    if (markedCount === 0) { alert("No attendance marked yet!"); return; }
    const data = students.map((s) => {
      const val = attendance[s.rollNumber];
      return {
        "Roll No": s.rollNumber,
        "Student Name": s.fullName,
        "PR Number": s.prNumber,
        "Year": year, "Division": division, "Date": selectedDate,
        "Status": val === true ? "Present" : val === false ? "Absent" : val === "DL" ? "Duty Leave" : "Not Marked",
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${year}_${division}_${selectedDate}.xlsx`);
  };

  const progress = totalStudents > 0 ? ((currentIndex + 1) / totalStudents) * 100 : 0;

  // Shared mark buttons used in both modals
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />

      {/* Hero Header */}
      <Box sx={{
        background: `linear-gradient(135deg, #064e3b 0%, #134e4a 50%, ${TEAL_DARK} 100%)`,
        pt: { xs: 3, md: 5 }, pb: { xs: 8, md: 10 }, px: { xs: 2, md: 5 },
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box sx={{ bgcolor: "rgba(255,255,255,0.12)", p: 1.2, borderRadius: 2.5, display: "flex" }}>
                  <EventNoteRoundedIcon sx={{ color: "white", fontSize: 22 }} />
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: 2, fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Attendance Management
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 900, letterSpacing: "-0.02em" }}>
                Mark Daily Attendance
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>
                {year} • Division {division} • {new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<DownloadRoundedIcon />}
                onClick={downloadReport} disabled={markedCount === 0}
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)", borderRadius: 2.5, textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" } }}>
                Export
              </Button>
              <Button variant="contained" startIcon={saving ? null : <SaveRoundedIcon />}
                onClick={saveRecords} disabled={markedCount === 0 || saving}
                sx={{ bgcolor: "white", color: "#064e3b", borderRadius: 2.5, fontWeight: 700, textTransform: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.15)", "&:hover": { bgcolor: "#f0fdf4" } }}>
                {saving ? <CircularProgress size={20} sx={{ color: "#064e3b" }} /> : "Save Records"}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4, position: "relative", zIndex: 2 }}>

        {/* Stats Row */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          {[
            { label: "Total Students", value: totalStudents, icon: <PeopleAltRoundedIcon />, color: TEAL },
            { label: "Present", value: presentCount, icon: <CheckCircleRoundedIcon />, color: "#10b981" },
            { label: "Absent", value: absentCount, icon: <CancelRoundedIcon />, color: "#ef4444" },
            { label: "Duty Leave", value: dutyLeaveCount, icon: <BadgeRoundedIcon />, color: "#eab308" },
          ].map((stat) => (
            <Paper key={stat.label} elevation={0} sx={{ flex: 1, p: 2.5, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white", display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, borderRadius: 2.5 }}>{stat.icon}</Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{stat.label}</Typography>
                <Typography variant="h5" fontWeight={900} color="#0f172a">{stat.value}</Typography>
              </Box>
            </Paper>
          ))}
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>{success}</Alert>}

        {/* Filter Bar */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Year</InputLabel>
              <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)} sx={{ borderRadius: 2 }}>
                <MenuItem value="FYBCA">FYBCA</MenuItem>
                <MenuItem value="SYBCA">SYBCA</MenuItem>
                <MenuItem value="TYBCA">TYBCA</MenuItem>
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

            {!markingDone ? (
              <Button variant="contained" startIcon={loading ? null : <PlayArrowRoundedIcon />}
                onClick={() => { setCurrentIndex(0); setMarkingOpen(true); }}
                disabled={loading || totalStudents === 0}
                sx={{ bgcolor: "#0f172a", borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 3, "&:hover": { bgcolor: "#1e293b" } }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : `Start Marking (${totalStudents} students)`}
              </Button>
            ) : (
              <Button variant="outlined" startIcon={<EditRoundedIcon />}
                onClick={() => { setCurrentIndex(0); setMarkingOpen(true); }}
                sx={{ borderColor: TEAL, color: TEAL, borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 3, "&:hover": { bgcolor: `${TEAL}10` } }}>
                Edit All
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Attendance Table */}
        {markedCount > 0 && (
          <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid #e2e8f0", bgcolor: "white", mb: 4 }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
              <Typography fontWeight={800} color="#0f172a">Attendance Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                {markedCount} of {totalStudents} marked • Click any row to edit
              </Typography>
            </Box>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  {["Roll No", "Student Name", "PR Number", "Status"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</TableCell>
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
                      <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>{student.rollNumber}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell sx={{ color: "#64748b", fontFamily: "monospace" }}>{student.prNumber}</TableCell>
                      <TableCell>
                        {chip ? (
                          <Chip label={chip.label} size="small"
                            sx={{ bgcolor: chip.bgcolor, color: chip.color, fontWeight: 700, border: "none" }} />
                        ) : <Typography variant="body2" color="#cbd5e1">—</Typography>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      {/* ── Main Marking Modal ── */}
      <Dialog open={markingOpen} onClose={() => setMarkingOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 5, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={800} color="white">
              {markingDone ? "Edit Attendance" : "Mark Attendance"}
            </Typography>
            <IconButton onClick={() => setMarkingOpen(false)} sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <LinearProgress variant="determinate" value={progress}
            sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.2)", "& .MuiLinearProgress-bar": { bgcolor: "white", borderRadius: 3 } }} />
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}>
            Student {currentIndex + 1} of {totalStudents}
          </Typography>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          {currentStudent && (
            <Box textAlign="center" py={1}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: `${TEAL}20`, color: TEAL, fontSize: "1.8rem", fontWeight: 900, mx: "auto", mb: 2, borderRadius: 4 }}>
                {currentStudent.fullName?.charAt(0)}
              </Avatar>
              <Typography variant="h5" fontWeight={800} color="#0f172a">{currentStudent.fullName}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Roll: {currentStudent.rollNumber} &nbsp;•&nbsp; PR: {currentStudent.prNumber}
              </Typography>
              <Typography variant="caption" sx={{ color: TEAL, fontWeight: 700 }}>{year} – Division {division}</Typography>
              <MarkButtons rollKey={currentStudent.rollNumber} onMark={markAttendance} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4, gap: 2 }}>
          <Button onClick={() => { if (!isFirst) setCurrentIndex((p) => p - 1); }} disabled={isFirst}
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600, flex: 1, py: 1.5, border: "1px solid #e2e8f0", color: "#475569" }}>
            ← Previous
          </Button>
          <Button variant="contained"
            onClick={() => isLast ? setMarkingOpen(false) : setCurrentIndex((p) => p + 1)}
            sx={{ bgcolor: "#0f172a", borderRadius: 2.5, textTransform: "none", fontWeight: 700, flex: 1, py: 1.5, "&:hover": { bgcolor: "#1e293b" } }}>
            {isLast ? "✓ Done" : "Next →"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Single Student Edit Modal ── */}
      <Dialog open={!!editStudent} onClose={() => setEditStudent(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 5, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={800} color="white">Edit Student</Typography>
            <IconButton onClick={() => setEditStudent(null)} sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          {editStudent && (
            <Box textAlign="center">
              <Avatar sx={{ width: 64, height: 64, bgcolor: `${TEAL}20`, color: TEAL, fontSize: "1.6rem", fontWeight: 900, mx: "auto", mb: 2, borderRadius: 3 }}>
                {editStudent.fullName?.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight={800} color="#0f172a">{editStudent.fullName}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Roll: {editStudent.rollNumber} &nbsp;•&nbsp; PR: {editStudent.prNumber}
              </Typography>
              <MarkButtons rollKey={editStudent.rollNumber} onMark={saveEditStudent} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}