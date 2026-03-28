import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import api from "../services/api";

const BulkStudentUpload = () => {
    const [previewData, setPreviewData] = useState([]);
    const [duplicates, setDuplicates] = useState([]); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setMessage(""); 
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            // Skip header row and filter out empty rows
            const rows = json.slice(1).filter(row => row.length > 0); 
            setPreviewData(rows);

            // Extract PR Numbers (Column index 2 based on your previous Excel structure)
            const prList = rows.map(r => String(r[2])).filter(pr => pr && pr !== "undefined" && pr !== "");
            
            try {
                // Check against database for existing PR numbers
                const res = await api.post('/api/admin/students/check-duplicates', prList);
                setDuplicates(res.data); 
            } catch (err) {
                console.error("Duplicate check failed", err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleConfirmUpload = async () => {
        if (!selectedFile) return;
        
        if (duplicates.length > 0) {
            alert("Please remove duplicate PR numbers from Excel before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);
        setMessage("");

        try {
            // Send to backend with explicit multipart header
            const response = await api.post('/api/admin/students/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMessage(`✅ ${response.data}`);
            
            // Reset state on success
            setPreviewData([]); 
            setSelectedFile(null);
            setDuplicates([]);

            // Refresh page to update dashboard stats after success
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            console.error("Upload Error:", err.response);
            const errorMsg = err.response?.data || "Upload failed. Check server permissions.";
            setMessage(`❌ Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Bulk Student Onboarding</h2>
            <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange} 
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer" 
            />

            {previewData.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Data Preview & Duplicate Check</h3>
                    <div className="overflow-x-auto border rounded-lg max-h-60">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">PR Number</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Year/Div</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {previewData.map((row, index) => {
                                    const isDuplicate = duplicates.includes(String(row[2]));
                                    return (
                                        <tr key={index} className={isDuplicate ? 'bg-red-50' : ''}>
                                            <td className="px-4 py-2 text-xs text-gray-700">{row[1]}</td>
                                            <td className={`px-4 py-2 text-xs font-bold ${isDuplicate ? 'text-red-600' : 'text-gray-700'}`}>
                                                {row[2]} {isDuplicate && <span className="ml-1 text-[10px] bg-red-100 px-1 rounded border border-red-200 uppercase">Exists</span>}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-gray-600">{row[4]} - {row[5]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {duplicates.length > 0 ? (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                            <p className="text-xs text-red-600 font-bold">
                                ⚠️ Found {duplicates.length} duplicate PR numbers. Please clean your Excel data to continue.
                            </p>
                        </div>
                    ) : (
                        <button 
                            onClick={handleConfirmUpload} 
                            disabled={loading}
                            className={`mt-4 w-full py-2 rounded-md text-white font-bold text-sm transition-all ${
                                loading ? 'bg-gray-400' : 'bg-[#0d9488] hover:bg-[#0f766e]'
                            }`}
                        >
                            {loading ? "Uploading..." : `Confirm & Upload ${previewData.length} Students`}
                        </button>
                    )}
                </div>
            )}

            {message && (
                <div className={`mt-4 p-3 rounded-md text-center text-xs font-bold ${
                    message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default BulkStudentUpload;