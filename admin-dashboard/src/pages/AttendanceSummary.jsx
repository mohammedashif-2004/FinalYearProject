import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import {
    Box, Typography, Table, TableBody, TableCell, TableHead,
    TableRow, Paper, Chip, IconButton, CircularProgress,
    MenuItem, Select, FormControl, InputLabel, Button, TextField, InputAdornment
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

export default function AttendanceSummary() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const year = searchParams.get("year");
    const division = searchParams.get("division");

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // NEW: Search state
    
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    const monthList = [
        { id: 1, name: "January" }, { id: 2, name: "February" }, { id: 3, name: "March" },
        { id: 4, name: "April" }, { id: 5, name: "May" }, { id: 6, name: "June" },
        { id: 7, name: "July" }, { id: 8, name: "August" }, { id: 9, name: "September" },
        { id: 10, name: "October" }, { id: 11, name: "November" }, { id: 12, name: "December" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let url = "/api/teacher/attendance/monthly-summary";
                let params = { year, division, month, calendarYear: 2026 };

                if (selectedDate) {
                    url = "/api/teacher/attendance/daily-status";
                    params = { year, division, date: selectedDate };
                }

                const res = await api.get(url, { params });
                setSummary(res.data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (year && division) fetchData();
    }, [year, division, month, selectedDate]);

    // NEW: Search & Stats Logic
    const filteredSummary = summary.filter(s => 
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.rollNumber.toString().includes(searchTerm)
    );

    const presentCount = summary.filter(s => s.status === "Present").length;
    const absentCount = summary.filter(s => s.status === "Absent").length;

    const downloadExcel = async () => {
        try {
            const res = await api.get("/api/teacher/attendance/daily-grid", {
                params: { year, division, month, calendarYear: 2026, startDate: startDate || null, endDate: endDate || null }
            });
            const { dates, students } = res.data;
            const headers = ["Roll No", "Full Name", ...dates.map(d => d.toString()), "Total %"];
            const rows = students.map(s => [
                s.rollNumber, s.fullName, ...dates.map(d => s.dailyAttendance[d] || "-"), s.percentage + "%"
            ]);
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
            XLSX.writeFile(workbook, `Attendance_${division}_Report.xlsx`);
        } catch (err) {
            console.error(err);
            alert("Error generating Excel report");
        }
    };

    const handleReset = () => {
        setStartDate(""); setEndDate(""); setSelectedDate(""); setSearchTerm("");
        setMonth(new Date().getMonth() + 1);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f1f5f9" }}>
            <Sidebar />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Topbar title="Attendance Summary" subtitle={`${year} BCA • Division ${division}`} />
                <Box sx={{ p: 3, overflowY: "auto" }}>
                    
                    {/* Header Filters */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: 1 }}><ArrowBackRoundedIcon /></IconButton>
                            <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset} sx={{ bgcolor: "white" }}>Reset</Button>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                label="View Specific Day" type="date" size="small" value={selectedDate}
                                onChange={(e) => { setSelectedDate(e.target.value); setStartDate(""); setEndDate(""); }}
                                InputLabelProps={{ shrink: true }} sx={{ bgcolor: "#fff9c4", width: 180 }}
                            />
                            <FormControl sx={{ minWidth: 140, bgcolor: 'white' }}>
                                <InputLabel>Month</InputLabel>
                                <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)} size="small">
                                    {monthList.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadExcel} sx={{ bgcolor: "#0d9488", height: 40 }}>Export Report</Button>
                        </Box>
                    </Box>

                    {/* Stats & Search Bar */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {selectedDate && (
                                <>
                                    <Chip label={`Present: ${presentCount}`} sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }} />
                                    <Chip label={`Absent: ${absentCount}`} sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700 }} />
                                </>
                            )}
                        </Box>
                        <TextField 
                            size="small"
                            placeholder="Search name or roll..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ bgcolor: 'white', width: 250 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start"><SearchIcon size="small" /></InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                        <Typography variant="h6" fontWeight={800} mb={3}>
                            {selectedDate ? `Daily Status: ${selectedDate}` : `Monthly Average: ${monthList.find(m => m.id === month)?.name} 2026`}
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                        ) : (
                            <Table>
                                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Roll No</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{selectedDate ? "Today's Status" : "Attendance %"}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Remark</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSummary.length > 0 ? filteredSummary.map((row) => (
                                        <TableRow key={row.rollNumber} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>{row.rollNumber}</TableCell>
                                            <TableCell>{row.fullName}</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: selectedDate ? row.statusColor : (row.percentage < 75 ? "#ef4444" : "#10b981") }}>
                                                {selectedDate ? row.status : `${row.percentage}%`}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={selectedDate ? row.status : (row.percentage < 75 ? "Defaulter" : "Clear")} 
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: selectedDate ? `${row.statusColor}22` : (row.percentage < 75 ? "#fee2e2" : "#dcfce7"), 
                                                        color: selectedDate ? row.statusColor : (row.percentage < 75 ? "#991b1b" : "#166534"), 
                                                        fontWeight: 700 
                                                    }} 
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No students found matching your search.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}