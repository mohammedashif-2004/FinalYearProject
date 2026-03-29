import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Table, TableBody, TableCell, TableHead,
    TableRow, Paper, Chip, IconButton, CircularProgress,
    Button, TextField, InputAdornment, Tooltip, MenuItem, Select, FormControl, InputLabel, TableContainer
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

const YEAR_LABEL = { 1: "FYBCA", 2: "SYBCA", 3: "TYBCA" };

export default function StudentDirectory() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const year = searchParams.get("year") || "1";
    const division = searchParams.get("division") || "A";

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/admin/students/filter", { 
                params: { year, division } 
            });
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [year, division]);

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(key, value);
        setSearchParams(newParams);
    };

    const handleEditClick = (student) => {
        setEditId(student.id);
        setEditData({ 
            prNumber: student.prNumber || "",
            phoneNumber: student.phone || "", 
            parentName: student.parentName || "",
            gender: student.gender || "",
            category: student.category || "",
            stateOfDomicile: student.stateOfDomicile || ""
        });
    };

    const handleSave = async (id) => {
        try {
            const payload = {
                prNumber: editData.prNumber,
                phoneNumber: editData.phoneNumber, 
                parentName: editData.parentName,
                gender: editData.gender,
                category: editData.category,
                stateOfDomicile: editData.stateOfDomicile
            };
            
            await api.put(`/api/admin/students/update/${id}`, payload);
            setEditId(null);
            fetchStudents();
        } catch (err) {
            alert("Update failed. Please check backend connection.");
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`⚠️ DANGER: Are you sure you want to delete ${name}? This will remove all their records permanently.`)) {
            try {
                await api.delete(`/api/admin/students/${id}`);
                fetchStudents();
            } catch (err) {
                alert("Delete failed. This student might have linked attendance records.");
            }
        }
    };

    const filteredStudents = students.filter(s => 
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.rollNumber.toString().includes(searchTerm) ||
        (s.prNumber && s.prNumber.toString().includes(searchTerm))
    );

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f1f5f9" }}>
            <Sidebar />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Topbar title="Student Management" subtitle="Complete Student Profiles" />
                
                <Box sx={{ p: 3, overflowY: "auto" }}>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <IconButton onClick={() => navigate("/dashboard")} sx={{ bgcolor: "white", boxShadow: 1 }}>
                                <ArrowBackRoundedIcon />
                            </IconButton>

                            <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'white' }}>
                                <InputLabel>Year</InputLabel>
                                <Select value={year} label="Year" onChange={(e) => handleFilterChange("year", e.target.value)}>
                                    <MenuItem value="1">FYBCA</MenuItem>
                                    <MenuItem value="2">SYBCA</MenuItem>
                                    <MenuItem value="3">TYBCA</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'white' }}>
                                <InputLabel>Division</InputLabel>
                                <Select value={division} label="Division" onChange={(e) => handleFilterChange("division", e.target.value)}>
                                    <MenuItem value="A">Division A</MenuItem>
                                    <MenuItem value="B">Division B</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <TextField 
                            placeholder="Search by name, roll, or PR..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ bgcolor: 'white', width: 320 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                            }}
                        />
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="subtitle2" fontWeight={700} color="#64748b">
                                {YEAR_LABEL[year]} - Division {division} ({filteredStudents.length} Students)
                            </Typography>
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                        ) : (
                            <Table sx={{ minWidth: 1500 }}>
                                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Roll No</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>PR Number</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Domicile</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Parent</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                                        <TableRow key={s.id} hover sx={{ bgcolor: (!s.phone || !s.prNumber) ? '#fffbeb' : 'inherit' }}>
                                            <TableCell sx={{ fontWeight: 700 }}>{s.rollNumber}</TableCell>
                                            
                                            <TableCell>
                                                {editId === s.id ? (
                                                    <TextField size="small" variant="standard" value={editData.prNumber} onChange={(e) => setEditData({...editData, prNumber: e.target.value})} />
                                                ) : (
                                                    s.prNumber || <Chip label="Empty" size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 600 }} />
                                                )}
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 500, minWidth: 200 }}>{s.fullName}</TableCell>

                                            <TableCell>
                                                {editId === s.id ? (
                                                    <Select size="small" variant="standard" value={editData.gender} onChange={(e) => setEditData({...editData, gender: e.target.value})}>
                                                        <MenuItem value="Male">Male</MenuItem>
                                                        <MenuItem value="Female">Female</MenuItem>
                                                        <MenuItem value="Other">Other</MenuItem>
                                                    </Select>
                                                ) : (s.gender || "—")}
                                            </TableCell>

                                            <TableCell>
                                                {editId === s.id ? (
                                                    <TextField size="small" variant="standard" value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})} />
                                                ) : (s.category || "—")}
                                            </TableCell>

                                            <TableCell>
                                                {editId === s.id ? (
                                                    <TextField size="small" variant="standard" value={editData.stateOfDomicile} onChange={(e) => setEditData({...editData, stateOfDomicile: e.target.value})} />
                                                ) : (s.stateOfDomicile || "—")}
                                            </TableCell>
                                            
                                            <TableCell>
                                                {editId === s.id ? (
                                                    <TextField size="small" variant="standard" value={editData.phoneNumber} onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})} />
                                                ) : (
                                                    s.phone || <Chip label="Empty" size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 600 }} />
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {editId === s.id ? (
                                                    <TextField size="small" variant="standard" value={editData.parentName} onChange={(e) => setEditData({...editData, parentName: e.target.value})} />
                                                ) : (s.parentName || "—")}
                                            </TableCell>

                                            <TableCell align="right">
                                                {editId === s.id ? (
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                        <IconButton onClick={() => handleSave(s.id)} color="primary"><SaveIcon /></IconButton>
                                                        <IconButton onClick={() => setEditId(null)} color="error"><CancelIcon /></IconButton>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                        <Button startIcon={<EditIcon />} size="small" onClick={() => handleEditClick(s)}>Edit</Button>
                                                        <IconButton onClick={() => handleDelete(s.id, s.fullName)} color="error" size="small">
                                                            <Tooltip title="Delete Student">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                                                            </Tooltip>
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={9} align="center" sx={{ py: 3 }}>No students found.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
}