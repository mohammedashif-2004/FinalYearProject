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

    // Add this to your AttendanceController.java
    @GetMapping("/monthly-summary")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySummary(
            @RequestParam Integer year,
            @RequestParam String division,
            @RequestParam Integer month,
            @RequestParam Integer calendarYear) {
        // This month parameter now changes based on the React dropdown
        System.out.println("Fetching Summary for: Year " + year + ", Div " + division + ", Month " + month);

        List<Map<String, Object>> summary = attendanceService.getMonthlySummary(year, division, month, calendarYear);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/daily-grid")
    public ResponseEntity<Map<String, Object>> getDailyGrid(
            @RequestParam Integer year,
            @RequestParam String division,
            @RequestParam Integer month,
            @RequestParam Integer calendarYear,
            @RequestParam(required = false) String startDate, // "YYYY-MM-DD"
            @RequestParam(required = false) String endDate) {

        Map<String, Object> gridData = attendanceService.getAttendanceGrid(
                year, division, month, calendarYear, startDate, endDate);
        return ResponseEntity.ok(gridData);
    }

    @GetMapping("/daily-status")
public ResponseEntity<List<Map<String, Object>>> getDailyStatus(
        @RequestParam Integer year,
        @RequestParam String division,
        @RequestParam String date) {
    
    return ResponseEntity.ok(attendanceService.getDailyStatusList(year, division, date));
}
}