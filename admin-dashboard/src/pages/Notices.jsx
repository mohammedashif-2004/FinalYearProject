import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box, Typography, Paper, Stack, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Dialog, DialogContent, DialogActions, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow, Chip, Alert, CircularProgress,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

const TYPE_COLORS = {
  General: { bg: "#e0f2fe", color: "#0369a1", icon: "ℹ️" },
  Exam:    { bg: "#fce7f3", color: "#9d174d", icon: "📝" },
  Holiday: { bg: "#dcfce7", color: "#166534", icon: "🎉" },
  Urgent:  { bg: "#fee2e2", color: "#991b1b", icon: "⚠️" },
};

export default function Notices() {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [noticeType, setNoticeType] = useState("General");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notices, setNotices] = useState([
    { id: 1, title: "Exam Schedule Released", type: "Exam", message: "Mid-semester exams scheduled for next month", date: "2026-03-20", file: null },
    { id: 2, title: "Holi Holiday Notice", type: "Holiday", message: "College will remain closed on Holi", date: "2026-03-18", file: null },
    { id: 3, title: "Urgent: Fee Submission", type: "Urgent", message: "Submit semester fees by 31st March", date: "2026-03-15", file: null },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredNotices = notices.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      setError("File size must be less than 5MB");
    }
  };

  const handlePublish = async () => {
    if (!title || !message) {
      setError("Title and message are required");
      return;
    }
    setIsPublishing(true);
    setError("");
    setSuccess("");
    try {
      const newNotice = {
        id: editingId || Date.now(),
        title,
        type: noticeType,
        message,
        date: new Date().toISOString().split("T")[0],
        file: selectedFile?.name || null,
      };
      if (editingId) {
        setNotices((prev) => prev.map((n) => (n.id === editingId ? newNotice : n)));
      } else {
        setNotices((prev) => [newNotice, ...prev]);
      }
      setSuccess(editingId ? "Notice updated successfully!" : "Notice published successfully!");
      setTitle("");
      setMessage("");
      setNoticeType("General");
      setSelectedFile(null);
      setEditingId(null);
      setModalOpen(false);
    } catch {
      setError("Failed to publish notice");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this notice?")) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
      setSuccess("Notice deleted");
    }
  };

  const handleEdit = (notice) => {
    setTitle(notice.title);
    setMessage(notice.message);
    setNoticeType(notice.type);
    setEditingId(notice.id);
    setModalOpen(true);
  };

  const handleNewNotice = () => {
    setTitle("");
    setMessage("");
    setNoticeType("General");
    setSelectedFile(null);
    setEditingId(null);
    setModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      <Sidebar activePath="/notices" />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title="Notices Management" subtitle="Create & manage college notices" />
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{success}</Alert>}

          {/* Header & Controls */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1.5, bgcolor: "#f8fafc", px: 2, borderRadius: 2.5, border: "1px solid #e2e8f0", minHeight: 40 }}>
                <SearchRoundedIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                <TextField
                  placeholder="Search notices..."
                  variant="standard"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ flex: 1, "& input": { fontSize: "0.9rem", color: "#0f172a" } }}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleNewNotice}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`,
                  boxShadow: "none",
                  px: 3,
                }}
              >
                New Notice
              </Button>
            </Stack>
          </Paper>

          {/* Stats */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
            {[
              { label: "Total Notices", value: notices.length, color: TEAL },
              { label: "General", value: notices.filter((n) => n.type === "General").length, color: "#0369a1" },
              { label: "Exams", value: notices.filter((n) => n.type === "Exam").length, color: "#9d174d" },
              { label: "Urgent", value: notices.filter((n) => n.type === "Urgent").length, color: "#991b1b" },
            ].map((stat) => (
              <Paper key={stat.label} elevation={0} sx={{ flex: 1, p: 2, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight={900} color={stat.color}>
                  {stat.value}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {/* Notices List */}
          <Stack spacing={2}>
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => {
                const typeStyle = TYPE_COLORS[notice.type];
                return (
                  <Paper
                    key={notice.id}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      bgcolor: "white",
                      transition: "all 0.2s",
                      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-start" }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: typeStyle.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          flexShrink: 0,
                        }}
                      >
                        {typeStyle.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5} flexWrap="wrap">
                          <Typography fontWeight={800} color="#0f172a" sx={{ fontSize: "1rem" }}>
                            {notice.title}
                          </Typography>
                          <Chip
                            label={notice.type}
                            size="small"
                            sx={{
                              bgcolor: typeStyle.bg,
                              color: typeStyle.color,
                              fontWeight: 700,
                              height: 24,
                            }}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                          {notice.message}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                          {new Date(notice.date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {notice.file && ` • 📎 ${notice.file}`}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.5} flexShrink={0}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(notice)}
                          sx={{
                            color: TEAL,
                            "&:hover": { bgcolor: "#f0fdf4" },
                          }}
                        >
                          <EditRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(notice.id)}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { bgcolor: "#fef2f2" },
                          }}
                        >
                          <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: 3,
                  border: "2px dashed #e2e8f0",
                  bgcolor: "#f8fafc",
                  textAlign: "center",
                }}
              >
                <NotificationsActiveRoundedIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                <Typography color="#94a3b8" fontWeight={600}>
                  {searchQuery ? "No notices match your search" : "No notices yet"}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Publish Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        <Box sx={{ background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={800} color="white">
                {editingId ? "Edit Notice" : "Create Notice"}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", mt: 0.3 }}>
                Share important information with students
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
              label="Notice Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select value={noticeType} label="Type" onChange={(e) => setNoticeType(e.target.value)} sx={{ borderRadius: 2 }}>
                {Object.keys(TYPE_COLORS).map((t) => (
                  <MenuItem key={t} value={t}>
                    {TYPE_COLORS[t].icon} {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={4}
              InputProps={{ sx: { borderRadius: 2 } }}
              size="small"
            />
            <Box>
              <Button
                variant="outlined"
                startIcon={<UploadFileRoundedIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#e2e8f0",
                  color: "#475569",
                }}
              >
                {selectedFile ? `📎 ${selectedFile.name}` : "Attach File (Max 5MB)"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileSelect}
              />
            </Box>
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
              color: "#475569",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePublish}
            disabled={isPublishing || !title || !message}
            sx={{
              flex: 1,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`,
              boxShadow: "none",
            }}
          >
            {isPublishing ? <CircularProgress size={20} /> : editingId ? "Update" : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}