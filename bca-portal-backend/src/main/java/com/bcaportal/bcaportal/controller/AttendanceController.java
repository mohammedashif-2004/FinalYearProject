package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.AttendanceRequest;
import com.bcaportal.bcaportal.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<String> markAttendance(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markAttendance(request));
    }
}