import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Box, Typography, Container, Avatar, Grid, Card, Button, Chip,
  Divider, Stack, TextField, IconButton, Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "SUPER_ADMIN";

  const [profile, setProfile] = useState({
    name: "Rajesh Kumar",
    role: "Senior Faculty Member",
    dept: "Department of Computer Science",
    email: "rajesh.kumar@bcacollege.edu.in",
    phone: "+91 98765 43210",
    about: "A dedicated educator with over a decade of experience fostering technical excellence. My teaching approach focuses on 'Learning by Doing,' integrating real-world industry projects with core theoretical concepts. Passionate about mentoring students to bridge the gap between academic learning and professional software engineering.",
    qualifications: "Ph.D. in Computer Science – Stanford University (2018)\nM.Tech in Software Systems – IIT Delhi (2012)\nB.E. in Computer Engineering – Mumbai University (2010)",
    experience: "8+ Years Academic Teaching at BCA College\n3 Years Senior Software Engineer at Google India\nVisiting Faculty at NMIMS University",
    skills: ["Java", "React.js", "Spring Boot", "Mentoring", "System Design", "Cloud Computing", "Python"],
  });

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 10 }}>
      <Navbar />

      {/* Cover Hero */}
      <Box sx={{
        background: `linear-gradient(135deg, #064e3b 0%, #134e4a 50%, ${TEAL_DARK} 100%)`,
        pt: { xs: 3, md: 5 }, pb: { xs: 12, md: 16 }, px: { xs: 2, md: 5 },
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ bgcolor: "rgba(255,255,255,0.12)", p: 1.2, borderRadius: 2.5, display: "flex" }}>
              <PersonRoundedIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: 2, fontSize: "0.75rem", textTransform: "uppercase" }}>
              Faculty Profile
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -10, position: "relative", zIndex: 2 }}>

        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white", overflow: "hidden", mb: 3 }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md="auto">
                  <Avatar sx={{
                    width: { xs: 90, md: 110 }, height: { xs: 90, md: 110 },
                    bgcolor: TEAL, fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 900,
                    border: "4px solid white", boxShadow: `0 8px 24px ${TEAL}40`,
                    mx: { xs: "auto", md: 0 },
                  }}>
                    {profile.name.charAt(0)}
                  </Avatar>
                </Grid>

                <Grid item xs={12} md>
                  {isEditing ? (
                    <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                      <TextField fullWidth name="name" label="Full Name" value={profile.name} onChange={handleChange} size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                      <TextField fullWidth name="role" label="Role" value={profile.role} onChange={handleChange} size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                    </Stack>
                  ) : (
                    <Box textAlign={{ xs: "center", md: "left" }}>
                      <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>{profile.name}</Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "center", md: "center" }} mt={1} flexWrap="wrap" justifyContent={{ xs: "center", md: "flex-start" }}>
                        <Chip label={profile.role} sx={{ bgcolor: `${TEAL}15`, color: TEAL, fontWeight: 700 }} />
                        <Chip label={role.replace("_", " ")} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600 }} />
                      </Stack>
                      <Typography color="text.secondary" mt={1} sx={{ fontSize: "0.9rem" }}>{profile.dept}</Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md="auto">
                  <Stack direction={{ xs: "row", md: "column" }} spacing={1.5} justifyContent="center">
                    {isEditing ? (
                      <>
                        <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={() => setIsEditing(false)} fullWidth
                          sx={{ bgcolor: "#10b981", borderRadius: 2.5, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#059669" } }}>
                          Save
                        </Button>
                        <Button variant="outlined" startIcon={<CancelRoundedIcon />} onClick={() => setIsEditing(false)} fullWidth
                          sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, borderColor: "#e2e8f0", color: "#475569" }}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => setIsEditing(true)}
                        sx={{ bgcolor: "#0f172a", borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 3, "&:hover": { bgcolor: "#1e293b" } }}>
                        Edit Profile
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>

              {/* Contact Info */}
              {!isEditing && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 3 }} mt={3} pt={3} sx={{ borderTop: "1px solid #f1f5f9" }} flexWrap="wrap">
                  <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                    <EmailRoundedIcon sx={{ fontSize: 16, color: TEAL }} />
                    <Typography variant="body2">{profile.email}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                    <PhoneRoundedIcon sx={{ fontSize: 16, color: TEAL }} />
                    <Typography variant="body2">{profile.phone}</Typography>
                  </Stack>
                </Stack>
              )}
              {isEditing && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3} pt={3} sx={{ borderTop: "1px solid #f1f5f9" }}>
                  <TextField fullWidth name="email" label="Email" value={profile.email} onChange={handleChange} size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                  <TextField fullWidth name="phone" label="Phone" value={profile.phone} onChange={handleChange} size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                </Stack>
              )}
            </Box>
          </Paper>
        </motion.div>

        <Grid container spacing={3}>
          {/* About */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white", height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                <Avatar sx={{ bgcolor: `${TEAL}15`, color: TEAL, width: 36, height: 36, borderRadius: 2 }}>
                  <PersonRoundedIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="h6" fontWeight={800} color="#0f172a">About</Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              {isEditing ? (
                <TextField fullWidth multiline rows={8} name="about" value={profile.about} onChange={handleChange} InputProps={{ sx: { borderRadius: 2 } }} />
              ) : (
                <Typography color="#475569" lineHeight={1.8}>{profile.about}</Typography>
              )}
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>

              {/* Qualifications */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "#e0e7ff", color: "#4f46e5", width: 36, height: 36, borderRadius: 2 }}>
                    <SchoolRoundedIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography fontWeight={800} color="#0f172a">Qualifications</Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {isEditing ? (
                  <TextField fullWidth multiline rows={4} name="qualifications" value={profile.qualifications} onChange={handleChange} InputProps={{ sx: { borderRadius: 2 } }} />
                ) : (
                  <Stack spacing={1}>
                    {profile.qualifications.split("\n").map((q, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: TEAL, mt: 0.8, flexShrink: 0 }} />
                        <Typography variant="body2" color="#475569" fontWeight={500}>{q}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>

              {/* Experience */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "#fef3c7", color: "#d97706", width: 36, height: 36, borderRadius: 2 }}>
                    <BadgeRoundedIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography fontWeight={800} color="#0f172a">Experience</Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {isEditing ? (
                  <TextField fullWidth multiline rows={3} name="experience" value={profile.experience} onChange={handleChange} InputProps={{ sx: { borderRadius: 2 } }} />
                ) : (
                  <Stack spacing={1}>
                    {profile.experience.split("\n").map((e, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#f59e0b", mt: 0.8, flexShrink: 0 }} />
                        <Typography variant="body2" color="#475569" fontWeight={500}>{e}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>

              {/* Skills */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "#ccfbf1", color: TEAL, width: 36, height: 36, borderRadius: 2 }}>
                    <MenuBookRoundedIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography fontWeight={800} color="#0f172a">Key Skills</Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {profile.skills.map((skill, i) => (
                    <Chip key={i} label={skill} size="small"
                      onDelete={isEditing ? () => setProfile({ ...profile, skills: profile.skills.filter((_, j) => j !== i) }) : undefined}
                      sx={{ bgcolor: `${TEAL}10`, color: TEAL, fontWeight: 700, border: `1px solid ${TEAL}25`, borderRadius: 2 }} />
                  ))}
                  {isEditing && (
                    <IconButton size="small" onClick={() => {
                      const s = prompt("Add a new skill:");
                      if (s) setProfile({ ...profile, skills: [...profile.skills, s] });
                    }} sx={{ color: TEAL, bgcolor: `${TEAL}10`, width: 32, height: 32, borderRadius: 2, "&:hover": { bgcolor: `${TEAL}20` } }}>
                      <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}