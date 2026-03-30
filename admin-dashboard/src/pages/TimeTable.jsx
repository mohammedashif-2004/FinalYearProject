import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api"; 
import {
  Box, Typography, Paper, Stack, Button, Select, MenuItem,
  FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tabs, Tab, Autocomplete, Alert,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CLASSES = ["FYBCA", "SYBCA", "TYBCA"];
const DIVISIONS = ["A", "B"];
const ALL_COMBOS = [
  { cls: "FYBCA", div: "A" }, { cls: "FYBCA", div: "B" },
  { cls: "SYBCA", div: "A" }, { cls: "SYBCA", div: "B" },
  { cls: "TYBCA", div: "A" }, { cls: "TYBCA", div: "B" },
];

const TYPE_STYLES = {
  Theory: { bg: "#e0f2fe", color: "#0369a1" },
  Lab: { bg: "#dcfce7", color: "#166534" },
  Break: { bg: "#fef3c7", color: "#92400e" },
};

function TimetableGrid({ schedule = {}, timeSlots, onCellClick, onDelete, onEditSlot, readOnly = false }) {
  return (
    <TableContainer sx={{ maxHeight: '75vh' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', width: 140 }}>Time</TableCell>
            {DAYS.map(day => <TableCell key={day} align="center" sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>{day}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((slot, idx) => (
            <TableRow key={slot + idx}>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#fafafa', position: 'relative', '&:hover .edit-slot': { opacity: 1 } }}>
                {slot}
                {!readOnly && (
                  <IconButton className="edit-slot" size="small" onClick={() => onEditSlot(idx)} sx={{ opacity: 0, position: 'absolute', right: 4, top: 4 }}>
                    <EditRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </TableCell>
              {DAYS.map(day => {
                const entry = schedule[`${day}__${slot}`];
                const isBreak = entry?.type === "Break";
                
                return (
                  <TableCell 
                    key={`${day}-${slot}`}
                    onClick={() => !readOnly && !entry && onCellClick(day, slot)}
                    sx={{ height: 95, cursor: entry ? "default" : "pointer", bgcolor: isBreak ? "#fffbeb" : "inherit", borderRight: '1px solid #f1f5f9' }}
                  >
                    {entry ? (
                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: TYPE_STYLES[entry.type]?.bg || "#f1f5f9", borderLeft: `4px solid ${TYPE_STYLES[entry.type]?.color || "#64748b"}`, position: 'relative' }}>
                            <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', lineHeight: 1.2 }}>
                                {isBreak ? "☕ " + entry.subject : entry.subject}
                            </Typography>
                            {!isBreak && <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.8, display: 'block' }}>{entry.teacher}</Typography>}
                            {entry.room && <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.6 }}>📍 {entry.room}</Typography>}
                            {!readOnly && (
                                <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0 }} onClick={(e) => { e.stopPropagation(); onDelete(day, slot, entry.id); }}>
                                    <CloseRoundedIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                            )}
                        </Box>
                     ) : !readOnly && <AddRoundedIcon sx={{ color: '#e2e8f0', display: 'block', mx: 'auto' }} />}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function TimeTable() {
  const [allData, setAllData] = useState({});
  const [allTeachers, setAllTeachers] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]); 
  const [currentClass, setCurrentClass] = useState("FYBCA");
  const [currentDiv, setCurrentDiv] = useState("A");
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("");
  const [activeSlot, setActiveSlot] = useState("");
  const [form, setForm] = useState({ subject: "", type: "Theory", teacherId: null, room: "" });
  const [timeSlots, setTimeSlots] = useState(["08:15 - 09:15", "09:15 - 10:15", "10:15 - 11:15", "11:15 - 11:30", "11:30 - 12:30", "12:30 - 01:30", "01:30 - 02:30"]);
  const [editSlotOpen, setEditSlotOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [newSlotTime, setNewSlotTime] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const [tRes, ttRes, subRes] = await Promise.all([
        api.get("/api/admin/teachers/all"),
        api.get("/api/admin/timetable/all"),
        api.get("/api/admin/subjects/all")
      ]);
      setAllTeachers(tRes.data || []);
      setDbSubjects(subRes.data || []); 
      
      // Debug Log: Check if subjects are actually arriving
      console.log("Fetched Subjects:", subRes.data);

      const transformed = {};
      ttRes.data?.forEach(item => {
        const key = `${item.className}-${item.division}`;
        const slotKey = `${item.day}__${item.timeSlot}`;
        if (!transformed[key]) transformed[key] = {};
        transformed[key][slotKey] = { ...item, teacher: item.teacher?.fullName };
      });
      setAllData(transformed);
    } catch (err) { setErrorMsg("Failed to sync with server."); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCellClick = (day, slot) => {
    setActiveDay(day); setActiveSlot(slot);
    setForm({ subject: "", type: "Theory", teacherId: null, room: "" });
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (form.type !== "Break" && (!form.subject || !form.teacherId)) {
        return setErrorMsg("Teacher & Subject required");
    }
    try {
      const payload = { ...form, day: activeDay, timeSlot: activeSlot, className: currentClass, division: currentDiv };
      await api.post("/api/admin/timetable/save", payload);
      fetchData(); setModalOpen(false);
    } catch (err) { setErrorMsg(err.response?.data || "Error saving session"); }
  };

  const handleDelete = async (day, slot, id) => {
    if (window.confirm("Delete this session?")) {
        await api.delete(`/api/admin/timetable/${id}`); fetchData();
    }
  };

  const handleEditSlot = (idx) => {
    setEditingIdx(idx);
    setNewSlotTime(timeSlots[idx]);
    setEditSlotOpen(true);
  };

  const saveNewSlotTime = () => {
    const updated = [...timeSlots];
    updated[editingIdx] = newSlotTime;
    setTimeSlots(updated);
    setEditSlotOpen(false);
  };

  // Helper to get subjects for the class dropdown
  const filteredSubjects = dbSubjects.filter(s => 
    String(s.year).trim().toUpperCase() === String(currentClass).trim().toUpperCase()
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f1f5f9" }}>
      <Sidebar activePath="/timetable" />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: 'hidden' }}>
        <Topbar title="Timetable Manager" />
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2 }}>
                    <Tab icon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Edit Timetable" />
                    <Tab icon={<GridViewRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="View All" />
                </Tabs>
            </Paper>

            {activeTab === 0 ? (
                <>
                    <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, borderRadius: 3, alignItems: 'center' }}>
                        <FormControl size="small" sx={{ width: 150 }}>
                            <InputLabel>Class</InputLabel>
                            <Select value={currentClass} label="Class" onChange={(e) => setCurrentClass(e.target.value)}>
                                {CLASSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ width: 150 }}>
                            <InputLabel>Division</InputLabel>
                            <Select value={currentDiv} label="Division" onChange={(e) => setCurrentDiv(e.target.value)}>
                                {DIVISIONS.map(d => <MenuItem key={d} value={d}>Division {d}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={fetchData} sx={{ borderRadius: 2 }}>Refresh Data</Button>
                    </Paper>

                    <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <TimetableGrid 
                            schedule={allData[`${currentClass}-${currentDiv}`]} 
                            timeSlots={timeSlots}
                            onCellClick={handleCellClick} 
                            onDelete={handleDelete}
                            onEditSlot={handleEditSlot}
                        />
                    </Paper>
                </>
            ) : (
                <Stack spacing={4}>
                    {ALL_COMBOS.map(({ cls, div }) => (
                        <Paper key={`${cls}-${div}`} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <Typography fontWeight={800}>{cls} — Division {div}</Typography>
                            </Box>
                            <TimetableGrid 
                                schedule={allData[`${cls}-${div}`]} 
                                timeSlots={timeSlots}
                                readOnly={true} 
                            />
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
      </Box>

      {/* MODAL: ADD SESSION */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ bgcolor: TEAL, color: 'white', fontWeight: 700 }}>Add Session: {activeDay}</DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {errorMsg && <Alert severity="error" sx={{ borderRadius: 2 }}>{errorMsg}</Alert>}
          
          <Box>
              <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ mb: 1, display: 'block' }}>SESSION TYPE</Typography>
              <Stack direction="row" spacing={1}>
                  {["Theory", "Lab", "Break"].map((type) => (
                      <Button 
                        key={type} fullWidth variant={form.type === type ? "contained" : "outlined"}
                        onClick={() => setForm({...form, type, subject: type === "Break" ? "BREAK" : ""})}
                        sx={{ 
                            borderRadius: 2, 
                            bgcolor: form.type === type ? TEAL : "transparent",
                            '&:hover': { bgcolor: form.type === type ? TEAL_DARK : "transparent" }
                        }}
                      >
                          {type}
                      </Button>
                  ))}
              </Stack>
          </Box>

          {form.type !== "Break" && (
            <>
                <FormControl fullWidth size="small">
                    <InputLabel>Subject</InputLabel>
                    <Select 
                      value={form.subject} 
                      label="Subject" 
                      onChange={(e) => setForm({...form, subject: e.target.value})}
                    >
                        {/* Fallback Check: If filter returns nothing, show all subjects as debug */}
                        {filteredSubjects.length > 0 ? (
                          filteredSubjects.map(s => <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>)
                        ) : (
                          dbSubjects.map(s => <MenuItem key={s.id} value={s.name}>{s.name} ({s.year})</MenuItem>)
                        )}
                        <MenuItem value="BREAK">☕ BREAK</MenuItem>
                    </Select>
                </FormControl>
                <Autocomplete
                    options={allTeachers}
                    getOptionLabel={(opt) => opt.fullName || ""}
                    onChange={(e, val) => setForm({...form, teacherId: val?.id})}
                    renderInput={(params) => <TextField {...params} label="Assign Teacher" size="small" />}
                />
            </>
          )}

          <TextField fullWidth size="small" label="Room / Lab" value={form.room} onChange={(e) => setForm({...form, room: e.target.value})} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} sx={{ bgcolor: TEAL, px: 3 }}>Save Session</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL: EDIT TIME SLOT */}
      <Dialog open={editSlotOpen} onClose={() => setEditSlotOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 700 }}>Update Time Timing</DialogTitle>
          <DialogContent>
              <TextField 
                fullWidth sx={{ mt: 1 }} label="Time Slot (e.g. 08:00 - 09:00)" 
                value={newSlotTime} onChange={(e) => setNewSlotTime(e.target.value)} 
                autoFocus
              />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setEditSlotOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={saveNewSlotTime} sx={{ bgcolor: TEAL }}>Update Slot</Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
}