import React, { useState, useEffect } from "react";
import { 
    Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
    Paper, Chip, Stack, CircularProgress, Alert, Tooltip, Button 
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

const TEAL = "#0d9488";

export default function TeacherDirectory() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            // Ensure this URL exactly matches your Java @GetMapping
            const res = await api.get("/api/admin/timetable/teachers-with-assignments");
            setTeachers(res.data);
            setError(null);
        } catch (err) {
            console.error("Full Error Object:", err.response);
            // If you see 403 here, it's definitely the SecurityConfig order
            setError(`Connection Error (${err.response?.status || 'Server Down'})`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f1f5f9" }}>
            <Sidebar activePath="/teachers" />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Topbar title="Faculty Directory" subtitle="Live Subject Assignments & Workload" />
                
                <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <GroupRoundedIcon sx={{ color: TEAL }} />
                            Teaching Staff ({teachers.length})
                        </Typography>
                        <Button 
                            startIcon={<RefreshRoundedIcon />} 
                            onClick={fetchTeachers}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: TEAL, borderColor: TEAL }}
                        >
                            Sync Assignments
                        </Button>
                    </Stack>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", overflow: 'hidden' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ "& th": { bgcolor: "#f8fafc", fontWeight: 700, color: "#64748b" } }}>
                                    <TableCell>ID Code</TableCell>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Live Assignments (From Timetable)</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                            <CircularProgress size={30} sx={{ color: TEAL }} />
                                            <Typography sx={{ mt: 2, color: 'text.secondary' }}>Fetching live data...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    teachers.map((t) => (
                                        <TableRow key={t.id} hover>
                                            <TableCell>{t.employeeCode}</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{t.fullName}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {t.assignments && t.assignments.length > 0 ? (
                                                        t.assignments.map((subject, idx) => (
                                                            <Chip 
                                                                key={idx} 
                                                                label={subject} 
                                                                size="small" 
                                                                sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 700 }} 
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography variant="caption" color="text.disabled">No sessions</Typography>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                {t.assignments?.length > 0 ? (
                                                    <Chip label="Active" size="small" sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 800 }} />
                                                ) : (
                                                    <Chip label="On Bench" size="small" variant="outlined" sx={{ opacity: 0.5 }} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}