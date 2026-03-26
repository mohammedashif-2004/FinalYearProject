import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box, Typography, Paper, Stack, Button, Dialog, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Chip, Alert,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

const EVENT_TYPES = {
  exam:     { label: "Exam",     color: "#6366f1", bg: "#e0e7ff", icon: <MenuBookRoundedIcon sx={{ fontSize: 14 }} /> },
  holiday:  { label: "Holiday",  color: "#f43f5e", bg: "#ffe4e6", icon: <EventRoundedIcon sx={{ fontSize: 14 }} /> },
  deadline: { label: "Deadline", color: "#f59e0b", bg: "#fef3c7", icon: <AccessTimeRoundedIcon sx={{ fontSize: 14 }} /> },
  event:    { label: "Event",    color: TEAL, bg: "#ccfbf1", icon: <StarRoundedIcon sx={{ fontSize: 14 }} /> },
};

const MOCK_EVENTS = [
  { id: 1, date: "2026-03-15", title: "Mid-Semester Exam", type: "exam", time: "10:00 – 13:00", location: "Block B" },
  { id: 2, date: "2026-03-25", title: "Holi Holiday", type: "holiday", time: "All Day", location: "Nationwide" },
  { id: 3, date: "2026-03-20", title: "Tech Fest 2026", type: "event", time: "09:00 – 18:00", location: "Main Ground" },
  { id: 4, date: "2026-03-31", title: "Assignment Submission", type: "deadline", time: "11:59 PM", location: "Online Portal" },
];

export default function AcademicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", date: "", type: "event", time: "", location: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    setForm({ 
      title: "", 
      date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, 
      type: "event", 
      time: "", 
      location: "" 
    });
    setModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!form.title || !form.date) {
      setError("Title and date are required");
      return;
    }
    setError("");
    setSuccess("");
    if (editingId) {
      setEvents((prev) => prev.map((e) => (e.id === editingId ? { ...form, id: editingId } : e)));
      setSuccess("Event updated!");
    } else {
      setEvents((prev) => [...prev, { ...form, id: Date.now() }]);
      setSuccess("Event added!");
    }
    setModalOpen(false);
    setEditingId(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditEvent = (event) => {
    setForm(event);
    setEditingId(event.id);
    setModalOpen(true);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm("Delete this event?")) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setSuccess("Event deleted");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      <Sidebar activePath="/calendar" />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title="Academic Calendar" subtitle="Manage college events & dates" />
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{success}</Alert>}

          <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
            {/* Calendar */}
            <Paper elevation={0} sx={{ flex: 1, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden", minWidth: 0 }}>
              <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <IconButton onClick={handlePrevMonth} sx={{ color: "white" }}>
                    <ChevronLeftRoundedIcon />
                  </IconButton>
                  <Typography variant="h6" fontWeight={800} color="white">
                    {monthName}
                  </Typography>
                  <IconButton onClick={handleNextMonth} sx={{ color: "white" }}>
                    <ChevronRightRoundedIcon />
                  </IconButton>
                </Stack>
              </Box>
              <Box sx={{ p: 3 }}>
                {/* Day headers */}
                <Stack direction="row" spacing={1} mb={2}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <Box key={d} sx={{ flex: 1, textAlign: "center", fontWeight: 700, color: "#475569", fontSize: "0.8rem" }}>
                      {d}
                    </Box>
                  ))}
                </Stack>

                {/* Calendar grid */}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                  {days.map((day, idx) => {
                    const dayEvents = getEventsForDate(day);
                    const isToday = day === new Date(2026, 2, 15);
                    return (
                      <Box
                        key={idx}
                        onClick={() => handleDateClick(day)}
                        sx={{
                          aspectRatio: "1",
                          p: 1,
                          borderRadius: 2,
                          border: isToday ? `2px solid ${TEAL}` : "1px solid #e2e8f0",
                          bgcolor: day ? (isToday ? "#ccfbf1" : "#fafafa") : "transparent",
                          cursor: day ? "pointer" : "default",
                          transition: "all 0.2s",
                          "&:hover": day ? { bgcolor: "#f0fdf4", borderColor: TEAL } : {},
                          display: "flex",
                          flexDirection: "column",
                          minHeight: 0,
                        }}
                      >
                        {day && (
                          <>
                            <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: isToday ? TEAL : "#0f172a" }}>
                              {day}
                            </Typography>
                            <Stack spacing={0.5} sx={{ flex: 1, overflowY: "auto", mt: 0.5 }}>
                              {dayEvents.slice(0, 2).map((evt) => {
                                const style = EVENT_TYPES[evt.type];
                                return (
                                  <Box
                                    key={evt.id}
                                    sx={{
                                      fontSize: "0.6rem",
                                      fontWeight: 700,
                                      px: 0.75,
                                      py: 0.3,
                                      borderRadius: 1,
                                      bgcolor: style.bg,
                                      color: style.color,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {evt.title}
                                  </Box>
                                );
                              })}
                              {dayEvents.length > 2 && (
                                <Typography sx={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 600 }}>
                                  +{dayEvents.length - 2} more
                                </Typography>
                              )}
                            </Stack>
                          </>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Paper>

            {/* Events List */}
            <Stack spacing={2} sx={{ width: { xs: "100%", lg: 320 } }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={800} color="#0f172a">Events</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<AddRoundedIcon />} 
                    size="small"
                    onClick={() => { 
                      setEditingId(null); 
                      setForm({ 
                        title: "", 
                        date: new Date().toISOString().split("T")[0], 
                        type: "event", 
                        time: "", 
                        location: "" 
                      }); 
                      setModalOpen(true); 
                    }}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, borderColor: "#e2e8f0", fontSize: "0.78rem" }}>
                    Add
                  </Button>
                </Stack>
              </Paper>

              <Stack spacing={2}>
                {events.length > 0 ? (
                  events.map((evt) => {
                    const style = EVENT_TYPES[evt.type];
                    return (
                      <Paper key={evt.id} elevation={0} sx={{ p: 2, borderRadius: 2.5, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: style.bg, display: "flex", alignItems: "center", justifyContent: "center", color: style.color, flexShrink: 0 }}>
                            {style.icon}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={700} color="#0f172a" sx={{ fontSize: "0.9rem" }}>{evt.title}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: "block" }}>
                              📅 {new Date(evt.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                            </Typography>
                            {evt.time && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>⏱ {evt.time}</Typography>}
                            {evt.location && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>📍 {evt.location}</Typography>}
                            <Chip label={EVENT_TYPES[evt.type].label} size="small" sx={{ mt: 1, bgcolor: style.bg, color: style.color, fontWeight: 700, height: 20 }} />
                          </Box>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            <IconButton size="small" onClick={() => handleEditEvent(evt)} sx={{ color: TEAL, "&:hover": { bgcolor: "#f0fdf4" } }}>
                              <EditRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteEvent(evt.id)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fef2f2" } }}>
                              <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })
                ) : (
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, border: "1px dashed #e2e8f0", bgcolor: "#f8fafc", textAlign: "center" }}>
                    <Typography color="#94a3b8" fontWeight={600} fontSize="0.9rem">
                      No events yet
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Event Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={800} color="white">
                {editingId ? "Edit Event" : "Add Event"}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", mt: 0.3 }}>
                {selectedDate ? `Date: ${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}` : "Create or update an event"}
              </Typography>
            </Box>
            <IconButton onClick={() => setModalOpen(false)} sx={{ color: "rgba(255,255,255,0.7)" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField 
              fullWidth 
              label="Event Title" 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              InputProps={{ sx: { borderRadius: 2 } }} 
              size="small" 
            />
            <TextField 
              fullWidth 
              label="Date" 
              type="date" 
              value={form.date} 
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputProps={{ sx: { borderRadius: 2 } }} 
              size="small"
              inputProps={{ max: "2026-12-31" }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Event Type</InputLabel>
              <Select 
                value={form.type} 
                label="Event Type" 
                onChange={(e) => setForm({ ...form, type: e.target.value })} 
                sx={{ borderRadius: 2 }}
              >
                {Object.entries(EVENT_TYPES).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val.icon} {val.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              fullWidth 
              label="Time" 
              value={form.time} 
              onChange={(e) => setForm({ ...form, time: e.target.value })} 
              placeholder="e.g., 10:00 - 13:00"
              InputProps={{ sx: { borderRadius: 2 } }} 
              size="small" 
            />
            <TextField 
              fullWidth 
              label="Location" 
              value={form.location} 
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              InputProps={{ sx: { borderRadius: 2 } }} 
              size="small" 
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button 
            onClick={() => setModalOpen(false)} 
            sx={{ 
              flex: 1, 
              borderRadius: 2.5, 
              textTransform: "none", 
              fontWeight: 600, 
              border: "1px solid #e2e8f0", 
              color: "#475569" 
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEvent}
            disabled={!form.title || !form.date}
            sx={{ 
              flex: 1, 
              borderRadius: 2.5, 
              textTransform: "none", 
              fontWeight: 700, 
              background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, 
              boxShadow: "none",
              "&:disabled": { opacity: 0.5 }
            }}
          >
            {editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}