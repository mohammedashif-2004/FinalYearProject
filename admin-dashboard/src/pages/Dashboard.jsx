import React, { useState } from "react";
import {
  Typography, Grid, Card, Box, Container, alpha,
  Avatar, Chip, IconButton, Paper, Stack, Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const menuItems = [
  { title: "Attendance", subtitle: "Mark & track daily student attendance", icon: <GroupRoundedIcon />, path: "/attendance", color: "#0d9488" },
  { title: "Academic Results", subtitle: "Grade processing & transcripts", icon: <DescriptionRoundedIcon />, path: "/results", color: "#0f766e" },
  { title: "Notice Board", subtitle: "Broadcast campus announcements", icon: <CampaignRoundedIcon />, path: "/notices", color: "#115e59" },
  { title: "Analytics", subtitle: "Performance & attendance trends", icon: <BarChartRoundedIcon />, path: "/reports", color: "#134e4a" },
  { title: "Event Calendar", subtitle: "Schedules & academic terms", icon: <EventAvailableRoundedIcon />, path: "/calendar", color: "#0d9488" },
  { title: "Time Table", subtitle: "Classroom & faculty allocation", icon: <ScheduleRoundedIcon />, path: "/timetable", color: "#0f766e" },
];

const quickStats = [
  { label: "Total Students", value: "240", sub: "6 divisions", icon: <PeopleAltRoundedIcon sx={{ fontSize: 20 }} />, color: "#0d9488" },
  { label: "Avg Attendance", value: "92%", sub: "+2% this month", icon: <TrendingUpRoundedIcon sx={{ fontSize: 20 }} />, color: "#2563eb" },
  { label: "Low Attendance", value: "8", sub: "students below 75%", icon: <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />, color: "#f59e0b" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "SUPER_ADMIN";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: { xs: 5, md: 10 } }}>

      {/* Hero */}
      <Box sx={{
        position: "relative",
        pt: { xs: 3, md: 5 },
        pb: { xs: 10, md: 15 },
        px: { xs: 2, md: 5 },
        background: "linear-gradient(135deg, #064e3b 0%, #134e4a 50%, #0f766e 100%)",
        overflow: "hidden",
      }}>
        {/* Dot grid */}
        <Box sx={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Watermark */}
        <Typography sx={{
          fontWeight: 900, color: "rgba(255,255,255,0.03)",
          position: "absolute", bottom: -20, left: 40,
          fontSize: { xs: "4rem", sm: "8rem", md: "12rem" },
          lineHeight: 1, userSelect: "none", textTransform: "uppercase",
          letterSpacing: { xs: -2, md: -8 }, display: { xs: "none", sm: "block" },
        }}>
          BCA
        </Typography>

        <Container maxWidth="xl">
          {/* Navbar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 4, md: 8 }, position: "relative", zIndex: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: "rgba(255,255,255,0.12)", p: 1, borderRadius: 2, display: "flex", backdropFilter: "blur(8px)" }}>
                <WidgetsRoundedIcon sx={{ color: "white", fontSize: { xs: 18, md: 22 } }} />
              </Box>
              <Typography sx={{ color: "white", fontWeight: 900, letterSpacing: { xs: 1, md: 2.5 }, fontSize: { xs: "0.8rem", md: "0.95rem" } }}>
                BCA PORTAL
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
              <IconButton sx={{ color: "white", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
                <NotificationsNoneRoundedIcon fontSize="small" />
              </IconButton>
              <Avatar onClick={() => navigate("/profile")} sx={{ cursor: "pointer", bgcolor: "rgba(255,255,255,0.2)", fontWeight: 700, fontSize: "0.9rem" }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton onClick={handleLogout} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Hero Text */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 700, letterSpacing: 2, fontSize: "0.75rem", textTransform: "uppercase", mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="h3" sx={{
              fontWeight: 900, color: "white", mb: 1,
              letterSpacing: "-0.03em", fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            }}>
              {username} &nbsp;
              <Chip label={role.replace("_", " ")} size="small" sx={{ height: 24, color: "white", fontWeight: 700, bgcolor: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }} />
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: { xs: "0.9rem", md: "1rem" } }}>
              Monitor campus performance and manage departmental operations.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl" sx={{ mt: { xs: -5, md: -8 }, position: "relative", zIndex: 2 }}>

        {/* Quick Stats */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 4, md: 5 } }}>
          {quickStats.map((stat, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Paper elevation={0} sx={{
                p: { xs: 2.5, md: 3.5 }, bgcolor: "white", borderRadius: { xs: 4, md: 5 },
                border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", gap: 2,
              }}>
                <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, borderRadius: 3, width: 50, height: 50 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.sub}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Section Title */}
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", gap: 1.5, fontSize: { xs: "1rem", md: "1.2rem" } }}>
          <Box sx={{ width: 6, height: 22, bgcolor: "#0d9488", borderRadius: 1 }} />
          Departmental Modules
        </Typography>

        {/* Module Cards */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} alignItems="stretch">
          {menuItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={item.title} sx={{ display: "flex" }}>
              <motion.div
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 22, delay: idx * 0.05 }}
                style={{ width: "100%", display: "flex" }}
              >
                <Card onClick={() => navigate(item.path)} sx={{
                  width: "100%", display: "flex", flexDirection: "column",
                  bgcolor: "white", cursor: "pointer",
                  borderRadius: { xs: 4, md: 5 }, border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { borderColor: item.color, boxShadow: `0 20px 40px -15px ${alpha(item.color, 0.18)}` },
                }}>
                  <Box sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", flex: 1 }}>
                    <Box sx={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: { xs: 50, md: 58 }, height: { xs: 50, md: 58 }, borderRadius: 3,
                      bgcolor: alpha(item.color, 0.1), color: item.color, mb: { xs: 2, md: 3 },
                      boxShadow: `inset 0 0 0 1px ${alpha(item.color, 0.12)}`, flexShrink: 0,
                    }}>
                      {React.cloneElement(item.icon, { sx: { fontSize: { xs: 24, md: 28 } } })}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.8, fontSize: { xs: "1rem", md: "1.1rem" } }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6, fontSize: { xs: "0.85rem", md: "0.875rem" }, flex: 1 }}>
                      {item.subtitle}
                    </Typography>
                    <Divider sx={{ my: 2.5 }} />
                    <Box sx={{ display: "flex", alignItems: "center", color: item.color, fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>
                      Open Module <EastRoundedIcon sx={{ ml: 1, fontSize: 15 }} />
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}