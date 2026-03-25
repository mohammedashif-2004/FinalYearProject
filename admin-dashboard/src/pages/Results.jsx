import React, { useState } from "react";
import Navbar from "../components/Navbar";

import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Stack,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import CloudUploadTwoToneIcon from "@mui/icons-material/CloudUploadTwoTone";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function ResultsUpload() {
  const [semester, setSemester] = useState("SEM1");

  const [results, setResults] = useState([
    {
      prNumber: "",
      name: "",
      math: "",
      science: "",
      english: "",
      total: 0
    }
  ]);

  const handleAddRow = () => {
    setResults([
      ...results,
      { prNumber: "", name: "", math: "", science: "", english: "", total: 0 }
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...results];
    updated[index][field] = value;

    const math = Number(updated[index].math || 0);
    const science = Number(updated[index].science || 0);
    const english = Number(updated[index].english || 0);

    updated[index].total = math + science + english;

    setResults(updated);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
          <Navbar />

    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Semester Result Upload
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Upload semester results securely. Only published results will be visible to students.
      </Typography>

      {/* Semester Selection */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Semester</InputLabel>
        <Select
          value={semester}
          label="Semester"
          onChange={(e) => setSemester(e.target.value)}
        >
          <MenuItem value="SEM1">Semester 1</MenuItem>
          <MenuItem value="SEM2">Semester 2</MenuItem>
          <MenuItem value="SEM3">Semester 3</MenuItem>
          <MenuItem value="SEM4">Semester 4</MenuItem>
        </Select>
      </FormControl>

      {/* Bulk Upload Section */}
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          mb: 4,
          textAlign: "center",
          borderStyle: "dashed",
          bgcolor: alpha("#6366F1", 0.02),
          borderColor: "primary.main"
        }}
      >
        <CloudUploadTwoToneIcon
          sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
        />
        <Typography variant="h6">Bulk Excel / CSV Upload</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload .xlsx or .csv file with PR Number and subject marks
        </Typography>
        <Button variant="contained" component="label">
          Select File
          <input type="file" hidden accept=".csv,.xlsx" />
        </Button>
      </Paper>

      {/* Manual Entry Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>PR Number</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Math</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Science</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>English</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="PR2024001"
                    value={row.prNumber}
                    onChange={(e) =>
                      handleInputChange(index, "prNumber", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Student Name"
                    value={row.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.math}
                    onChange={(e) =>
                      handleInputChange(index, "math", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.science}
                    onChange={(e) =>
                      handleInputChange(index, "science", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.english}
                    onChange={(e) =>
                      handleInputChange(index, "english", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Typography fontWeight={600}>{row.total}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack
          direction="row"
          spacing={2}
          sx={{ p: 2, justifyContent: "space-between" }}
        >
          <Button startIcon={<AddRoundedIcon />} onClick={handleAddRow}>
            Add Student
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<SaveRoundedIcon />}
          >
            Publish Semester Result
          </Button>
        </Stack>
      </TableContainer>
    </Box>
    </Box>
  );
}