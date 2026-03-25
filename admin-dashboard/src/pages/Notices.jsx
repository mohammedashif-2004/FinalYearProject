import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Typography, TextField, Button, Paper, Box, Container, Stack,
  IconButton, Chip, Divider, InputAdornment, Dialog, AppBar,
  Toolbar, Slide, DialogContent, Avatar, Alert, CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Eye, FileWarning, Send, Paperclip, X, Bell } from "lucide-react";
import React from "react";
import { createNotice, getAllNotices, deleteNotice } from "../services/api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

const TYPE_COLORS = {
  General: { bg: "#e0f2fe", color: "#0369a1" },
  Exam:    { bg: "#fce7f3", color: "#9d174d" },
  Holiday: { bg: "#dcfce7", color: "#166534" },
  Urgent:  { bg: "#fee2e2", color: "#991b1b" },
};

export default function Notices() {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [noticeType, setNoticeType] = useState("General");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewFileUrl, setViewFileUrl] = useState("");
  const [viewFileName, setViewFileName] = useState("");

  // Fetch notices from backend on load
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await getAllNotices();
      setNotices(response.data);
    } catch {
      setError("Failed to load notices. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices
    .filter((n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handlePublish = async () => {
    if (!title.trim() || !message.trim()) return;
    setIsPublishing(true);
    setError("");
    setSuccess("");

    try {
      const response = await createNotice({
        title: title.trim(),
        message: message.trim(),
        type: noticeType,
      });
      setNotices((prev) => [response.data, ...prev]);
      setTitle("");
      setMessage("");
      setSelectedFile(null);
      setNoticeType("General");
      setSuccess("Notice published successfully!");
    } catch {
      setError("Failed to publish notice. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setError("Failed to delete notice.");
    }
  };

  const openViewer = (file) => {
    if (!file) return;
    setViewFileUrl(URL.createObjectURL(file));
    setViewFileName(file.name);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    URL.revokeObjectURL(viewFileUrl);
    setViewFileUrl("");
  };

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
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Box sx={{ bgcolor: "rgba(255,255,255,0.12)", p: 1.2, borderRadius: 2.5, display: "flex" }}>
              <Bell size={20} color="white" />
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: 2, fontSize: "0.75rem", textTransform: "uppercase" }}>
              Campus Communication
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 900, letterSpacing: "-0.02em" }}>Notice Board</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>
            {notices.length} notice{notices.length !== 1 ? "s" : ""} published
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4, pb: 8, position: "relative", zIndex: 2 }}>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError("")}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccess("")}>{success}</Alert>}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 360px" }, gap: 3 }}>

          {/* LEFT: Notices List */}
          <Stack spacing={3}>
            <TextField fullWidth placeholder="Search notices..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search size={18} color="#94a3b8" /></InputAdornment>,
                sx: { borderRadius: 3, bgcolor: "white", "& fieldset": { borderColor: "#e2e8f0" } }
              }} />

            {loading ? (
              <Box textAlign="center" py={6}>
                <CircularProgress sx={{ color: TEAL }} />
                <Typography color="text.secondary" mt={2}>Loading notices...</Typography>
              </Box>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredNotices.length === 0 ? (
                  <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: "1px solid #e2e8f0", textAlign: "center" }}>
                    <FileWarning size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                    <Typography color="text.secondary" fontWeight={600}>No notices found</Typography>
                    <Typography variant="body2" color="text.secondary">Create one using the panel on the right</Typography>
                  </Paper>
                ) : (
                  filteredNotices.map((notice) => (
                    <motion.div key={notice.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <Paper elevation={0} sx={{
                        borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden",
                        "&:hover": { borderColor: TEAL, boxShadow: `0 4px 20px rgba(13,148,136,0.08)` }, transition: "all 0.2s"
                      }}>
                        <Box sx={{ p: 3 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Stack direction="row" spacing={2} alignItems="flex-start" flex={1}>
                              <Avatar sx={{ bgcolor: `${TEAL}15`, color: TEAL, borderRadius: 2.5, width: 44, height: 44, fontWeight: 900, fontSize: "1.1rem", flexShrink: 0 }}>
                                {new Date(notice.createdAt).getDate()}
                              </Avatar>
                              <Box flex={1}>
                                <Stack direction="row" spacing={1} alignItems="center" mb={0.5} flexWrap="wrap">
                                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: "1rem" }}>{notice.title}</Typography>
                                  <Chip label={notice.type || "General"} size="small"
                                    sx={{ bgcolor: TYPE_COLORS[notice.type]?.bg || "#f1f5f9", color: TYPE_COLORS[notice.type]?.color || "#475569", fontWeight: 700, height: 22, fontSize: "0.7rem" }} />
                                </Stack>
                                <Stack direction="row" spacing={1.5}>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">•</Typography>
                                  <Typography variant="caption" color="text.secondary">By {notice.createdBy}</Typography>
                                </Stack>
                              </Box>
                            </Stack>
                            <IconButton size="small" onClick={() => handleDelete(notice.id)}
                              sx={{ color: "#cbd5e1", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}>
                              <Trash2 size={15} />
                            </IconButton>
                          </Stack>
                          <Typography variant="body2" sx={{ color: "#475569", mt: 2, lineHeight: 1.7 }}>{notice.message}</Typography>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            )}
          </Stack>

          {/* RIGHT: Publish Panel */}
          <Box sx={{ position: "sticky", top: 24, alignSelf: "start" }}>
            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden" }}>
              <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
                <Typography variant="h6" fontWeight={800} color="white">Create Notice</Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>Publish to all students & faculty</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <TextField fullWidth label="Notice Title" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    InputProps={{ sx: { borderRadius: 2.5 } }} />

                  <TextField select fullWidth label="Type" value={noticeType}
                    onChange={(e) => setNoticeType(e.target.value)}
                    InputProps={{ sx: { borderRadius: 2.5 } }}>
                    {["General", "Exam", "Holiday", "Urgent"].map((t) => (
                      <option key={t} value={t} style={{ padding: "8px 16px" }}>{t}</option>
                    ))}
                  </TextField>

                  <TextField fullWidth multiline rows={4} label="Message" value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    InputProps={{ sx: { borderRadius: 2.5 } }} />

                  <Box onClick={() => fileInputRef.current.click()}
                    sx={{ border: "2px dashed #e2e8f0", borderRadius: 2.5, p: 2.5, textAlign: "center", cursor: "pointer", transition: "all 0.2s", "&:hover": { borderColor: TEAL, bgcolor: `${TEAL}05` } }}>
                    <input type="file" hidden ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files[0])} accept="application/pdf,image/*" />
                    <Paperclip size={20} color={selectedFile ? TEAL : "#94a3b8"} style={{ marginBottom: 6 }} />
                    <Typography variant="caption" color={selectedFile ? TEAL : "text.secondary"} fontWeight={600} display="block">
                      {selectedFile ? selectedFile.name : "Attach PDF or Image (optional)"}
                    </Typography>
                  </Box>

                  <Button fullWidth variant="contained" startIcon={isPublishing ? null : <Send size={16} />}
                    onClick={handlePublish} disabled={isPublishing || !title || !message}
                    sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 700, textTransform: "none", background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, "&:hover": { opacity: 0.92 } }}>
                    {isPublishing ? <CircularProgress size={20} color="inherit" /> : "Publish Notice"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Viewer Modal */}
      <Dialog fullScreen open={viewerOpen} onClose={closeViewer} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative", bgcolor: "#0f172a" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeViewer}><X /></IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">{viewFileName}</Typography>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0, bgcolor: "#1e293b" }}>
          <iframe src={`${viewFileUrl}#toolbar=0`} title="Viewer" width="100%" height="100%" style={{ border: "none" }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
