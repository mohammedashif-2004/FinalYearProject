import React, { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { 
  Box, Paper, TextField, Button, MenuItem, Typography, 
  Stack, Chip, Snackbar, Alert, CircularProgress 
} from "@mui/material";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function SubjectManager() {
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({ name: "", year: "FYBCA" });
    const [loading, setLoading] = useState(false);
    
    // Notification State
    const [notification, setNotification] = useState({ 
        open: false, 
        message: "", 
        severity: "success" 
    });

    // 1. Fetch Subjects from Backend
    const fetchSubjects = async () => {
    try {
        const res = await api.get("/api/admin/subjects/all");
        console.log("SERVER RESPONSE:", res.data); // <--- OPEN YOUR BROWSER CONSOLE (F12)
        
        // Ensure we are setting an array
        if (Array.isArray(res.data)) {
            setSubjects(res.data);
        } else {
            console.error("Expected an array but got:", typeof res.data);
            setSubjects([]); 
        }
    } catch (err) {
        console.error("Failed to fetch subjects", err);
    }
};

    useEffect(() => { 
        fetchSubjects(); 
    }, []);

    // 2. Save New Subject
    const handleSave = async () => {
        if (!form.name.trim()) return;
        
        setLoading(true);
        try {
            await api.post("/api/admin/subjects/add", form);
            
            setNotification({ 
                open: true, 
                message: `${form.name} added successfully!`, 
                severity: "success" 
            });

            setForm({ ...form, name: "" }); // Reset text field
            fetchSubjects(); // Refresh the list
        } catch (err) {
            const errorMsg = err.response?.data || "Failed to add subject.";
            setNotification({ 
                open: true, 
                message: errorMsg, 
                severity: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete Subject
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await api.delete(`/api/admin/subjects/${id}`);
                setNotification({ 
                    open: true, 
                    message: `"${name}" removed.`, 
                    severity: "info" 
                });
                fetchSubjects(); // Refresh list
            } catch (err) {
                setNotification({ 
                    open: true, 
                    message: "Error deleting subject.", 
                    severity: "error" 
                });
            }
        }
    };

    const handleCloseNotification = () => setNotification({ ...notification, open: false });

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f1f5f9" }}>
            <Sidebar activePath="/subjects" />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: 'hidden' }}>
                <Topbar title="Subject Management" />
                
                <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
                    {/* ADD SUBJECT SECTION */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" fontWeight={800} mb={2}>Add New Subject</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField 
                                label="Subject Name (e.g. Java Programming)" 
                                size="small" 
                                fullWidth
                                value={form.name} 
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                disabled={loading}
                                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                            />
                            <TextField 
                                select 
                                label="Class" 
                                size="small" 
                                sx={{ minWidth: 150 }}
                                value={form.year} 
                                onChange={(e) => setForm({...form, year: e.target.value})}
                                disabled={loading}
                            >
                                {["FYBCA", "SYBCA", "TYBCA"].map(y => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))}
                            </TextField>
                            
                            <Button 
                                variant="contained" 
                                onClick={handleSave} 
                                disabled={loading || !form.name.trim()}
                                sx={{ 
                                    bgcolor: "#0d9488", 
                                    px: 4, 
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: "#0f766e" }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Add Subject"}
                            </Button>
                        </Stack>
                    </Paper>

                    {/* SUBJECT LIST SECTION */}
                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', minHeight: '60vh' }}>
                        <Typography variant="h6" fontWeight={800} mb={3}>
                            All Subjects ({subjects.length})
                        </Typography>
                        
                        {subjects.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
                                <BookRoundedIcon sx={{ fontSize: 48, mb: 1 }} />
                                <Typography>No subjects added yet.</Typography>
                            </Box>
                        ) : (
                            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                {subjects.map((s) => (
                                    <Chip 
                                        key={s.id}
                                        icon={<BookRoundedIcon sx={{ fontSize: 18 }} />}
                                        label={`${s.name} (${s.year})`}
                                        onDelete={() => handleDelete(s.id, s.name)}
                                        deleteIcon={<DeleteRoundedIcon sx={{ color: '#ef4444 !important' }} />}
                                        sx={{ 
                                            p: 1.5, 
                                            height: 45, 
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            bgcolor: 'white',
                                            border: '1px solid #e2e8f0',
                                            '&:hover': { bgcolor: '#f8fafc' }
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* NOTIFICATION POPUP */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={4000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity} 
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}