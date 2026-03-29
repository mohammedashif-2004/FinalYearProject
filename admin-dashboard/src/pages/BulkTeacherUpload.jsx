import React, { useState, useRef } from 'react';
import { 
    Box, Button, Typography, Paper, LinearProgress, Alert, Chip, 
    Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Stack 
} from '@mui/material';
import * as XLSX from 'xlsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

export default function BulkTeacherUpload() {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                setPreviewData(data); // Show all rows in preview
            };
            reader.readAsBinaryString(selectedFile);
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        try {
            const res = await api.post("/api/admin/teachers/bulk-upload", formData);
            setMessage({ type: 'success', text: res.data });
            setFile(null);
            setPreviewData([]);
        } catch (err) {
            setMessage({ type: 'error', text: "Upload failed. Check file format." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f8fafc", overflow: "hidden" }}>
            <Sidebar activePath="/bulk-teachers" />
            
            {/* Main Content Area - This now handles scrolling */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Topbar title="Faculty Onboarding" subtitle="Bulk Import System" />
                
                <Box sx={{ p: 4, flex: 1, overflowY: "auto" }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, borderRadius: 4, mb: 4, textAlign: 'center', 
                            border: '2px dashed #cbd5e1', bgcolor: 'white' 
                        }}
                    >
                        <input type="file" accept=".xlsx" hidden ref={fileInputRef} onChange={handleFileChange} />
                        <CloudUploadIcon 
                            sx={{ fontSize: 54, color: '#0d9488', mb: 1, cursor: 'pointer' }} 
                            onClick={() => fileInputRef.current.click()} 
                        />
                        <Typography variant="h6" fontWeight={700} color="#1e293b">
                            {file ? "File Selected" : "Select Teacher Spreadsheet"}
                        </Typography>
                        {file && (
                            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                                <Chip 
                                    label={file.name} 
                                    onDelete={() => {setFile(null); setPreviewData([]);}} 
                                    color="primary"
                                />
                            </Stack>
                        )}
                    </Paper>

                    {previewData.length > 0 && (
                        <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#64748b">
                                    DATA PREVIEW ({previewData.length - 1} Teachers)
                                </Typography>
                            </Box>
                            
                            {/* Scrollable Table Wrapper */}
                            <TableContainer sx={{ maxHeight: 450 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            {previewData[0].map((header, i) => (
                                                <TableCell key={i} sx={{ fontWeight: 800, bgcolor: '#f1f5f9' }}>{header}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {previewData.slice(1).map((row, rowIndex) => (
                                            <TableRow key={rowIndex} hover>
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell key={cellIndex}>{cell || "—"}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 2 }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    disabled={loading}
                                    onClick={handleUpload}
                                    sx={{ bgcolor: '#0d9488', py: 1.5, fontWeight: 700, borderRadius: 2 }}
                                >
                                    {loading ? "Importing to Database..." : "Confirm & Import Teachers"}
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    onClick={() => {setFile(null); setPreviewData([]);}}
                                    sx={{ px: 4, borderRadius: 2 }}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </Paper>
                    )}

                    {loading && <LinearProgress sx={{ mt: 2, borderRadius: 5 }} />}
                    {message.text && (
                        <Alert severity={message.type} sx={{ mt: 3, borderRadius: 2 }}>
                            {message.text}
                        </Alert>
                    )}
                </Box>
            </Box>
        </Box>
    );
}