package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.AttendanceRequest;
import com.bcaportal.bcaportal.dto.AttendanceResponse;
import com.bcaportal.bcaportal.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Mark attendance (teacher only)
    @PostMapping("/attendance")
    public ResponseEntity<String> markAttendance(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markAttendance(request));
    }

    // Get monthly report for a division (teacher/admin)
    @GetMapping("/attendance/report")
    public ResponseEntity<List<AttendanceResponse>> getMonthlyReport(
            @RequestParam Integer year,
            @RequestParam String division,
            @RequestParam Integer month,
            @RequestParam Integer acadYear) {
        return ResponseEntity.ok(
                attendanceService.getMonthlyReport(year, division, month, acadYear));
    }

    // Get single student attendance (student can view own)
    @GetMapping("/attendance/student/{prNumber}")
    public ResponseEntity<AttendanceResponse> getStudentAttendance(
            @PathVariable String prNumber,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(
                attendanceService.getStudentAttendance(prNumber, month, year));
    }
}

