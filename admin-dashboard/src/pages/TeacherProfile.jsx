import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box, Typography, Paper, Stack, Button, TextField, Avatar, IconButton, Tabs, Tab,
  Dialog, DialogContent, DialogActions, Alert, Divider,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "SUPER_ADMIN";

  const [profile, setProfile] = useState({
    name: "Dr. Priya Sharma",
    email: "priya.sharma@bca.edu",
    phone: "+91-9876543210",
    designation: "Senior Faculty",
    department: "Computer Science",
    qualification: "M.Tech, PhD",
    joinDate: "2018-06-15",
    address: "Pune, Maharashtra",
    bio: "Experienced educator with 10+ years in computer science education",
    subjects: ["Web Technology", "Database Management", "Cloud Computing"],
    classes: ["SYBCA Division A", "SYBCA Division B", "TYBCA Division A"],
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!editForm.name || !editForm.email) {
      setError("Name and email are required");
      return;
    }
    try {
      await new Promise((r) => setTimeout(r, 800));
      setProfile({ ...editForm });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...profile });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      <Sidebar activePath="/profile" />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title="Teacher Profile" subtitle="Manage your profile information" />
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{success}</Alert>}

          {/* Profile Header */}
          <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white", background: `linear-gradient(135deg, rgba(6,78,59,0.05), rgba(15,118,110,0.05))` }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "flex-start" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: TEAL,
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  boxShadow: "0 4px 12px rgba(13,148,136,0.2)",
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                {isEditing ? (
                  <TextField fullWidth label="Full Name" value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    variant="standard" sx={{ mb: 1 }} />
                ) : (
                  <Typography variant="h5" fontWeight={900} color="#0f172a">
                    {profile.name}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {profile.designation} • {profile.department}
                </Typography>
                <Typography variant="caption" sx={{ color: "#0d9488", fontWeight: 700, mt: 1, display: "block" }}>
                  {profile.qualification}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                {!isEditing ? (
                  <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={handleEditClick}
                    sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, borderColor: TEAL, color: TEAL }}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleSave}
                      sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: `linear-gradient(135deg, #064e3b, ${TEAL_DARK})`, boxShadow: "none" }}>
                      Save
                    </Button>
                    <Button variant="outlined" startIcon={<CancelRoundedIcon />} onClick={handleCancel}
                      sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, borderColor: "#e2e8f0" }}>
                      Cancel
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </Paper>

          {/* Tabs */}
          <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden" }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
              sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 48 }, "& .Mui-selected": { color: TEAL }, "& .MuiTabs-indicator": { bgcolor: TEAL } }}>
              <Tab label="Personal Info" />
              <Tab label="Contact Details" />
              <Tab label="Professional" />
              <Tab label="Classes & Subjects" />
            </Tabs>
          </Paper>

          {/* TAB 0: Personal Info */}
          {activeTab === 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
              <Typography fontWeight={800} color="#0f172a" mb={2}>Personal Information</Typography>
              <Stack spacing={2.5}>
                {[
                  { label: "Full Name", key: "name", icon: <BadgeRoundedIcon /> },
                  { label: "Designation", key: "designation", icon: <SchoolRoundedIcon /> },
                  { label: "Department", key: "department", icon: <SchoolRoundedIcon /> },
                  { label: "Bio", key: "bio", multiline: true, icon: null },
                  { label: "Joined Date", key: "joinDate", type: "date", icon: <CalendarMonthRoundedIcon /> },
                ].map((field) => (
                  <Box key={field.key}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      {field.icon && <Box sx={{ color: TEAL }}>{field.icon}</Box>}
                      <Typography fontWeight={600} color="#475569" sx={{ fontSize: "0.9rem" }}>
                        {field.label}
                      </Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField fullWidth size="small" value={editForm[field.key]}
                        onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                        multiline={field.multiline} rows={field.multiline ? 3 : 1}
                        type={field.type || "text"}
                        InputProps={{ sx: { borderRadius: 2 } }} />
                    ) : (
                      <Typography color="#0f172a" sx={{ pl: field.icon ? 4 : 0 }}>
                        {profile[field.key]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* TAB 1: Contact Details */}
          {activeTab === 1 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
              <Typography fontWeight={800} color="#0f172a" mb={2}>Contact Information</Typography>
              <Stack spacing={2.5}>
                {[
                  { label: "Email", key: "email", type: "email", icon: <MailRoundedIcon /> },
                  { label: "Phone", key: "phone", icon: <PhoneRoundedIcon /> },
                  { label: "Address", key: "address", multiline: true, icon: <LocationOnRoundedIcon /> },
                ].map((field) => (
                  <Box key={field.key}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <Box sx={{ color: TEAL }}>{field.icon}</Box>
                      <Typography fontWeight={600} color="#475569" sx={{ fontSize: "0.9rem" }}>
                        {field.label}
                      </Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField fullWidth size="small" value={editForm[field.key]}
                        onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                        multiline={field.multiline} rows={field.multiline ? 2 : 1}
                        type={field.type || "text"}
                        InputProps={{ sx: { borderRadius: 2 } }} />
                    ) : (
                      <Typography color="#0f172a" sx={{ pl: 4 }}>
                        {profile[field.key]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* TAB 2: Professional */}
          {activeTab === 2 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
              <Typography fontWeight={800} color="#0f172a" mb={2}>Professional Details</Typography>
              <Stack spacing={2.5}>
                {[
                  { label: "Qualification", key: "qualification", icon: <SchoolRoundedIcon /> },
                  { label: "Department", key: "department", icon: <SchoolRoundedIcon /> },
                  { label: "Designation", key: "designation", icon: <BadgeRoundedIcon /> },
                  { label: "Join Date", key: "joinDate", type: "date", icon: <CalendarMonthRoundedIcon /> },
                ].map((field) => (
                  <Box key={field.key}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <Box sx={{ color: TEAL }}>{field.icon}</Box>
                      <Typography fontWeight={600} color="#475569" sx={{ fontSize: "0.9rem" }}>
                        {field.label}
                      </Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField fullWidth size="small" value={editForm[field.key]}
                        onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                        type={field.type || "text"}
                        InputProps={{ sx: { borderRadius: 2 } }} />
                    ) : (
                      <Typography color="#0f172a" sx={{ pl: 4 }}>
                        {profile[field.key]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* TAB 3: Classes & Subjects */}
          {activeTab === 3 && (
            <Stack spacing={2.5}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Typography fontWeight={800} color="#0f172a" mb={2}>Assigned Subjects</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {profile.subjects.map((subj) => (
                    <Box key={subj} sx={{
                      bgcolor: "#ccfbf1", color: TEAL, fontWeight: 700, fontSize: "0.85rem",
                      px: 2.5, py: 1, borderRadius: 2.5, border: `1px solid ${TEAL}20`,
                    }}>
                      {subj}
                    </Box>
                  ))}
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Typography fontWeight={800} color="#0f172a" mb={2}>Assigned Classes</Typography>
                <Stack spacing={1.5}>
                  {profile.classes.map((cls) => (
                    <Box key={cls} sx={{ p: 2, borderRadius: 2.5, border: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SchoolRoundedIcon sx={{ color: TEAL, fontSize: 18 }} />
                        <Typography fontWeight={700} color="#0f172a">{cls}</Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}