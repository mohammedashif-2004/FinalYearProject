import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Box, Container, Paper, Typography, IconButton, Stack, Chip,
  Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  MenuItem, Tooltip, Divider, Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Clock, MapPin, Plus, X,
  BookOpen, Sun, AlertCircle, Star, Trash2, Calendar,
} from "lucide-react";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

const EVENT_TYPES = {
  exam:     { label: "Exam",     color: "#6366f1", bg: "#e0e7ff", icon: <BookOpen size={14} /> },
  holiday:  { label: "Holiday",  color: "#f43f5e", bg: "#ffe4e6", icon: <Sun size={14} /> },
  deadline: { label: "Deadline", color: "#f59e0b", bg: "#fef3c7", icon: <AlertCircle size={14} /> },
  event:    { label: "Event",    color: "#0d9488", bg: "#ccfbf1", icon: <Star size={14} /> },
};

const MOCK_EVENTS = [
  { id: 1, date: "2026-03-15", title: "Mid-Semester Exam", type: "exam", time: "10:00 – 13:00", location: "Block B" },
  { id: 2, date: "2026-03-25", title: "Holi Holiday", type: "holiday", time: "All Day", location: "Nationwide" },
  { id: 3, date: "2026-03-20", title: "Tech Fest 2026", type: "event", time: "09:00 – 18:00", location: "Main Ground" },
  { id: 4, date: "2026-03-31", title: "Assignment Submission", type: "deadline", time: "11:59 PM", location: "Online Portal" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AcademicCalendar() {
  const today = new Date();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 15));
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", type: "event", time: "", location: "" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const getEventsForDate = (d) => {
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return events.filter((e) => e.date === str);
  };

  const handleAdd = () => {
    const str = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    setEvents([...events, { ...newEvent, id: Date.now(), date: str }]);
    setOpen(false);
    setNewEvent({ title: "", type: "event", time: "", location: "" });
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />

      {/* Hero */}
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
                  <EventAvailableRoundedIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: 2, fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Academic Year 2025–26
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 900, letterSpacing: "-0.02em" }}>Academic Calendar</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>Manage schedules, exams, and holidays</Typography>
            </Box>

            {/* Month Navigator */}
            <Paper elevation={0} sx={{ display: "flex", alignItems: "center", borderRadius: 3, overflow: "hidden", bgcolor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
              <IconButton onClick={() => setCurrentDate(new Date(year, month - 1, 1))} sx={{ color: "white", borderRadius: 0, px: 2 }}>
                <ChevronLeft size={20} />
              </IconButton>
              <Typography sx={{ color: "white", fontWeight: 800, px: 2, minWidth: 160, textAlign: "center", fontSize: "1rem" }}>
                {MONTHS[month]} {year}
              </Typography>
              <IconButton onClick={() => setCurrentDate(new Date(year, month + 1, 1))} sx={{ color: "white", borderRadius: 0, px: 2 }}>
                <ChevronRight size={20} />
              </IconButton>
            </Paper>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4, pb: 8, position: "relative", zIndex: 2 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>

          {/* Calendar Grid */}
          <Paper elevation={0} sx={{ flex: 2, borderRadius: 4, overflow: "hidden", border: "1px solid #e2e8f0", bgcolor: "white" }}>
            {/* Weekday Headers */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {DAYS.map((d) => (
                <Box key={d} sx={{ py: 2, textAlign: "center" }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>{d}</Typography>
                </Box>
              ))}
            </Box>

            {/* Day Cells */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", bgcolor: "#f1f5f9", gap: "1px" }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <Box key={`e-${i}`} sx={{ bgcolor: "#fafafa", minHeight: { xs: 70, md: 110 } }} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(year, month, day);
                const isSelected = selectedDate.toDateString() === dateObj.toDateString();
                const isToday = today.toDateString() === dateObj.toDateString();
                const dayEvents = getEventsForDate(dateObj);
                const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                return (
                  <Box key={day} onClick={() => setSelectedDate(dateObj)} sx={{
                    bgcolor: isSelected ? "#f0fdf4" : isWeekend ? "#fafafa" : "white",
                    minHeight: { xs: 70, md: 110 }, p: 1.5, cursor: "pointer",
                    transition: "all 0.15s", "&:hover": { bgcolor: "#f0fdf4" },
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography sx={{
                        width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "50%", fontWeight: isToday ? 900 : 500, fontSize: "0.875rem",
                        bgcolor: isToday ? TEAL : "transparent",
                        color: isToday ? "white" : isWeekend ? "#94a3b8" : "#0f172a",
                      }}>
                        {day}
                      </Typography>
                    </Box>
                    <Stack spacing={0.4} mt={0.8}>
                      {dayEvents.slice(0, 2).map((ev) => (
                        <Tooltip key={ev.id} title={ev.title}>
                          <Box sx={{
                            px: 0.8, py: 0.3, borderRadius: 1, bgcolor: EVENT_TYPES[ev.type].bg,
                            display: { xs: "none", sm: "block" },
                          }}>
                            <Typography variant="caption" fontWeight={700} color={EVENT_TYPES[ev.type].color} sx={{ fontSize: "0.65rem", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {ev.title}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))}
                      {/* Mobile: just dots */}
                      <Stack direction="row" spacing={0.4} sx={{ display: { xs: "flex", sm: "none" } }}>
                        {dayEvents.map((ev) => (
                          <Box key={ev.id} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: EVENT_TYPES[ev.type].color }} />
                        ))}
                      </Stack>
                      {dayEvents.length > 2 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", display: { xs: "none", sm: "block" } }}>+{dayEvents.length - 2} more</Typography>
                      )}
                    </Stack>
                  </Box>
                );
              })}

              {Array.from({ length: Math.max(0, 42 - (daysInMonth + firstDay)) }).map((_, i) => (
                <Box key={`f-${i}`} sx={{ bgcolor: "#fafafa", minHeight: { xs: 70, md: 110 } }} />
              ))}
            </Box>
          </Paper>

          {/* Side Panel */}
          <Box sx={{ flex: "0 0 320px", minWidth: 0 }}>
            <Paper elevation={0} sx={{
              borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white",
              overflow: "hidden", position: { lg: "sticky" }, top: 24,
            }}>
              {/* Selected Date Header */}
              <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h5" fontWeight={900} color="white">
                      {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
                      {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<Plus size={14} />} onClick={() => setOpen(true)}
                    sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", borderRadius: 2.5, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "rgba(255,255,255,0.22)" } }}>
                    Add
                  </Button>
                </Stack>
              </Box>

              {/* Event Type Legend */}
              <Box sx={{ p: 2.5, borderBottom: "1px solid #f1f5f9" }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {Object.entries(EVENT_TYPES).map(([key, val]) => (
                    <Chip key={key} label={val.label} size="small" icon={val.icon}
                      sx={{ bgcolor: val.bg, color: val.color, fontWeight: 700, height: 24, fontSize: "0.7rem", "& .MuiChip-icon": { color: val.color } }} />
                  ))}
                </Stack>
              </Box>

              {/* Events for Selected Date */}
              <Box sx={{ p: 2.5 }}>
                <AnimatePresence mode="popLayout">
                  {selectedEvents.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Box textAlign="center" py={4}>
                        <Calendar size={36} color="#cbd5e1" style={{ marginBottom: 12 }} />
                        <Typography color="text.secondary" fontWeight={600}>No events today</Typography>
                        <Typography variant="body2" color="text.secondary">Click Add to create one</Typography>
                      </Box>
                    </motion.div>
                  ) : (
                    <Stack spacing={2}>
                      {selectedEvents.map((ev) => (
                        <motion.div key={ev.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                          <Paper elevation={0} sx={{
                            p: 2, borderRadius: 3, border: "1px solid #f1f5f9",
                            display: "flex", gap: 1.5, alignItems: "flex-start",
                            "&:hover": { borderColor: EVENT_TYPES[ev.type].color, transform: "translateY(-1px)" },
                            transition: "all 0.2s",
                          }}>
                            <Box sx={{ width: 4, borderRadius: 4, bgcolor: EVENT_TYPES[ev.type].color, alignSelf: "stretch", flexShrink: 0 }} />
                            <Box flex={1}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                  <Typography variant="body2" fontWeight={800} color="#0f172a">{ev.title}</Typography>
                                  <Chip label={EVENT_TYPES[ev.type].label} size="small"
                                    sx={{ bgcolor: EVENT_TYPES[ev.type].bg, color: EVENT_TYPES[ev.type].color, fontWeight: 700, height: 18, fontSize: "0.65rem", mt: 0.5 }} />
                                </Box>
                                <IconButton size="small" onClick={() => setEvents(events.filter((e) => e.id !== ev.id))}
                                  sx={{ color: "#cbd5e1", width: 24, height: 24, "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}>
                                  <Trash2 size={13} />
                                </IconButton>
                              </Stack>
                              <Stack direction="row" spacing={2} mt={1}>
                                <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                                  <Clock size={11} /><Typography variant="caption">{ev.time}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                                  <MapPin size={11} /><Typography variant="caption">{ev.location}</Typography>
                                </Stack>
                              </Stack>
                            </Box>
                          </Paper>
                        </motion.div>
                      ))}
                    </Stack>
                  )}
                </AnimatePresence>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* Add Event Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={800} color="white">Add Event</Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
                {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "rgba(255,255,255,0.7)" }}><X size={20} /></IconButton>
          </Stack>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField fullWidth label="Event Title" value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              InputProps={{ sx: { borderRadius: 2 } }} />
            <TextField select fullWidth label="Type" value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              InputProps={{ sx: { borderRadius: 2 } }}>
              {Object.entries(EVENT_TYPES).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: val.color }} />
                    <Typography variant="body2">{val.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2}>
              <TextField fullWidth label="Time" placeholder="10:00 AM" value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                InputProps={{ sx: { borderRadius: 2 } }} />
              <TextField fullWidth label="Location" placeholder="Room 101" value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                InputProps={{ sx: { borderRadius: 2 } }} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600, flex: 1, border: "1px solid #e2e8f0", color: "#475569" }}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!newEvent.title}
            sx={{ flex: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, boxShadow: "none" }}>
            Save Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}