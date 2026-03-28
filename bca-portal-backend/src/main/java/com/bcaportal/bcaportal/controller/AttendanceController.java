package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.AttendanceRequest;
import com.bcaportal.bcaportal.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/teacher/attendance") // Base path
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/save") // Combined with base, this is /api/teacher/attendance/save
    public ResponseEntity<String> saveAttendance(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markAttendance(request));
    }

    // Location:
    // src/main/java/com/bcaportal/bcaportal/controller/AttendanceController.java

    @GetMapping("/check") // React calls: /api/teacher/attendance/check
    public ResponseEntity<Map<String, Boolean>> checkAttendance(
            @RequestParam Integer year,
            @RequestParam String division,
            @RequestParam String date) {
        
        Map<String, Boolean> attendanceMap = attendanceService.getAttendanceMap(year, division, date);
        return ResponseEntity.ok(attendanceMap);
    }
}