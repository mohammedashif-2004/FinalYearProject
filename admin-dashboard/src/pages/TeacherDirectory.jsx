import React, { useState, useEffect } from "react";
import { 
    Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Select, FormControl, InputLabel, Chip, Stack, Divider 
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

export default function TeacherDirectory() {
    const [teachers, setTeachers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [form, setForm] = useState({ year: '', division: '', subject: '' });

    const fetchTeachers = async () => {
        try {
            const res = await api.get("/api/admin/teachers/all");
            setTeachers(res.data);
        } catch (err) {
            console.error("Error fetching teachers", err);
        }
    };

    useEffect(() => { fetchTeachers(); }, []);

    const handleOpen = (t) => {
        setSelectedTeacher(t);
        // Reset form for a new assignment
        setForm({ year: '', division: '', subject: '' });
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            // Updated to POST to your new multiple-assignment endpoint
            await api.post(`/api/admin/teachers/assign/${selectedTeacher.id}`, form);
            setOpen(false);
            fetchTeachers();
        } catch (err) {
            alert("Error saving assignment. Check console.");
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if(window.confirm("Remove this assignment?")) {
            await api.delete(`/api/admin/teachers/assignment/${assignmentId}`);
            fetchTeachers();
            setOpen(false);
        }
    }

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f1f5f9" }}>
            <Sidebar activePath="/teachers" />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Topbar title="Teacher Directory" subtitle="Manage Faculty & Multiple Assignments" />
                <Box sx={{ p: 3, overflowY: "auto" }}>
                    <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                <TableRow>
                                    <TableCell>Code</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Assigned Classes & Subjects</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {teachers.map((t) => (
                                    <TableRow key={t.id} hover>
                                        <TableCell>{t.employeeCode}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{t.fullName}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {t.assignments && t.assignments.length > 0 ? (
                                                    t.assignments.map((asgn) => (
                                                        <Chip 
                                                            key={asgn.id}
                                                            label={`${asgn.assignedSubject} (FY${asgn.assignedYear}-${asgn.assignedDivision})`} 
                                                            size="small" 
                                                            color="primary" 
                                                            variant="outlined"
                                                        />
                                                    ))
                                                ) : (
                                                    <Chip label="No Assignments" size="small" />
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button 
                                                variant="contained" 
                                                size="small" 
                                                onClick={() => handleOpen(t)} 
                                                sx={{ bgcolor: "#0d9488", textTransform: 'none' }}
                                            >
                                                Add Assignment
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>Manage Assignments: {selectedTeacher?.fullName}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    
                    {selectedTeacher?.assignments?.length > 0 && (
                        <>
                            <Typography variant="caption" fontWeight={700} color="textSecondary">CURRENTLY TEACHING</Typography>
                            <Stack spacing={1}>
                                {selectedTeacher.assignments.map((asgn) => (
                                    <Box key={asgn.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#f8fafc', borderRadius: 1 }}>
                                        <Typography variant="body2">{asgn.assignedSubject} (FY{asgn.assignedYear}-{asgn.assignedDivision})</Typography>
                                        <Button color="error" size="small" onClick={() => handleDeleteAssignment(asgn.id)}>Remove</Button>
                                    </Box>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 1 }} />
                        </>
                    )}

                    <Typography variant="caption" fontWeight={700} color="textSecondary">ADD NEW ASSIGNMENT</Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel>Year</InputLabel>
                        <Select value={form.year} label="Year" onChange={(e) => setForm({...form, year: e.target.value})}>
                            <MenuItem value={1}>1st Year (FY)</MenuItem>
                            <MenuItem value={2}>2nd Year (SY)</MenuItem>
                            <MenuItem value={3}>3rd Year (TY)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel>Division</InputLabel>
                        <Select value={form.division} label="Division" onChange={(e) => setForm({...form, division: e.target.value})}>
                            <MenuItem value="A">Division A</MenuItem>
                            <MenuItem value="B">Division B</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField 
                        label="Subject Name" 
                        fullWidth 
                        size="small" 
                        value={form.subject} 
                        onChange={(e) => setForm({...form, subject: e.target.value})} 
                        placeholder="e.g. Java, Python" 
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Close</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        disabled={!form.year || !form.division || !form.subject}
                        sx={{ bgcolor: "#0d9488", '&:hover': {bgcolor: '#0f766e'} }}
                    >
                        Add Subject
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}