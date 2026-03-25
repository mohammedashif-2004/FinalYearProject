import React from "react";
import Navbar from "../components/Navbar";
import {
  Typography, Box, Container, Grid, Paper, Button, Stack,
  Avatar, Divider, LinearProgress, Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Users, Award, Clock, Download, ArrowUpRight } from "lucide-react";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

const attendanceData = [
  { month: "Oct", rate: 88 }, { month: "Nov", rate: 92 }, { month: "Dec", rate: 85 },
  { month: "Jan", rate: 94 }, { month: "Feb", rate: 91 }, { month: "Mar", rate: 96 },
];

const divisionData = [
  { div: "FY-A", present: 36, absent: 4 }, { div: "FY-B", present: 38, absent: 2 },
  { div: "SY-A", present: 32, absent: 8 }, { div: "SY-B", present: 35, absent: 5 },
  { div: "TY-A", present: 37, absent: 3 }, { div: "TY-B", present: 33, absent: 7 },
];

const StatCard = ({ title, value, sub, icon: Icon, color, chip }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white" }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{title}</Typography>
        <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ my: 0.5 }}>{value}</Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <ArrowUpRight size={14} color="#10b981" />
          <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700 }}>{sub}</Typography>
        </Stack>
      </Box>
      <Avatar sx={{ bgcolor: `${color}15`, color, width: 48, height: 48, borderRadius: 3 }}>
        <Icon size={22} />
      </Avatar>
    </Stack>
  </Paper>
);

export default function Reports() {
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
                  <BarChartRoundedIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: 2, fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Institutional Analytics
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 900, letterSpacing: "-0.02em" }}>Analytics Dashboard</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>Performance metrics for Academic Year 2025–26</Typography>
            </Box>
            <Button variant="contained" startIcon={<Download size={18} />}
              sx={{ bgcolor: "white", color: "#064e3b", borderRadius: 2.5, fontWeight: 700, textTransform: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.15)", "&:hover": { bgcolor: "#f0fdf4" } }}>
              Export PDF
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4, pb: 8, position: "relative", zIndex: 2 }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Stats Row */}
          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Students" value="240" sub="+12 this year" icon={Users} color="#2563eb" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Avg Attendance" value="92.4%" sub="+2.1% this month" icon={Clock} color={TEAL} /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Avg Score" value="76.8" sub="+4.3% this sem" icon={TrendingUp} color="#f59e0b" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Distinctions" value="38" sub="+8 this sem" icon={Award} color="#8b5cf6" /></Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Attendance Trend Chart */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                  <Box>
                    <Typography fontWeight={800} color="#0f172a">Attendance Trend</Typography>
                    <Typography variant="body2" color="text.secondary">Monthly attendance rate across all divisions</Typography>
                  </Box>
                  <Chip label="Oct – Mar 2026" size="small" sx={{ bgcolor: "#f1f5f9", color: "#64748b", fontWeight: 600 }} />
                </Stack>
                <Box sx={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceData}>
                      <defs>
                        <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={TEAL} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[70, 100]} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }} />
                      <Area type="monotone" dataKey="rate" stroke={TEAL} strokeWidth={3} fill="url(#tealGrad)" dot={{ fill: TEAL, r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Low Attendance Alerts */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white", height: "100%" }}>
                <Typography fontWeight={800} color="#0f172a" mb={1}>Attendance by Division</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Today's snapshot</Typography>
                <Stack spacing={2.5}>
                  {divisionData.map((d) => {
                    const pct = Math.round((d.present / 40) * 100);
                    const isLow = pct < 75;
                    return (
                      <Box key={d.div}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.8}>
                          <Typography variant="body2" fontWeight={700} color="#0f172a">{d.div}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" color="text.secondary">{d.present}/40</Typography>
                            <Chip label={`${pct}%`} size="small"
                              sx={{ bgcolor: isLow ? "#fee2e2" : "#dcfce7", color: isLow ? "#991b1b" : "#166534", fontWeight: 700, height: 20, fontSize: "0.7rem" }} />
                          </Stack>
                        </Stack>
                        <LinearProgress variant="determinate" value={pct}
                          sx={{ height: 7, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: isLow ? "#ef4444" : TEAL, borderRadius: 4 } }} />
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>

            {/* Division Bar Chart */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                  <Box>
                    <Typography fontWeight={800} color="#0f172a">Present vs Absent by Division</Typography>
                    <Typography variant="body2" color="text.secondary">Today's attendance breakdown</Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: TEAL }} />
                      <Typography variant="caption" fontWeight={600} color="text.secondary">Present</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: "#fca5a5" }} />
                      <Typography variant="caption" fontWeight={600} color="text.secondary">Absent</Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Box sx={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={divisionData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="div" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }} />
                      <Bar dataKey="present" fill={TEAL} radius={[6, 6, 0, 0]} />
                      <Bar dataKey="absent" fill="#fca5a5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}