package com.bcaportal.bcaportal.service;

import lombok.extern.slf4j.Slf4j;
import com.bcaportal.bcaportal.dto.AttendanceRequest;
import com.bcaportal.bcaportal.entity.Attendance;
import com.bcaportal.bcaportal.entity.StudentProfile;
import com.bcaportal.bcaportal.repository.AttendanceRepository;
import com.bcaportal.bcaportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public String markAttendance(AttendanceRequest request) {
        if (request.getAttendance() == null || request.getAttendance().isEmpty()) {
            return "No data provided";
        }

        request.getAttendance().forEach((rollNumber, isPresent) -> {
            studentRepository.findByRollNumberAndYearAndDivision(
                    rollNumber, request.getYear(), request.getDivision()).ifPresent(student -> {
                        Attendance attendance = attendanceRepository.findByStudentAndDate(student, request.getDate())
                                .orElse(new Attendance());

                        attendance.setStudent(student);
                        attendance.setDate(request.getDate());
                        attendance.setPresent(isPresent);
                        attendance.setMonth(request.getDate().getMonthValue());
                        attendance.setYear(request.getYear()); // Academic Year (1, 2, 3)

                        attendanceRepository.save(attendance);
                    });
        });
        return "Attendance marked successfully!";
    }

    public Map<String, Boolean> getAttendanceMap(Integer year, String division, String date) {
        try {
            // Parse the date coming from React
            LocalDate localDate = LocalDate.parse(date);

            // Call the updated repository method
            List<Attendance> records = attendanceRepository.findByYearAndDateAndDivision(year, localDate, division);

            Map<String, Boolean> attendanceMap = new HashMap<>();
            for (Attendance record : records) {
                // Check for null to prevent crashes
                if (record.getStudent() != null) {
                    attendanceMap.put(record.getStudent().getRollNumber(), record.isPresent());
                }
            }
            return attendanceMap;
        } catch (Exception e) {
            log.error("Error fetching attendance: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    public List<Map<String, Object>> getMonthlySummary(Integer academicYear, String division, int month,
            int calendarYear) {
        // 1. Find all students belonging to the specific Academic Year (1, 2, or 3) and
        // Division
        List<StudentProfile> students = studentRepository.findByYearAndDivision(academicYear, division);

        List<Map<String, Object>> summaryList = new ArrayList<>();

        // DEBUG: To see if students are actually being found
        System.out.println("Fetching Summary for: Year " + academicYear + " Div " + division + " | Students found: "
                + students.size());

        for (StudentProfile student : students) {
            // 2. Count Present and Total days
            // We use 'academicYear' (1,2,3) because that's what the attendance table stores
            // now
            long present = attendanceRepository.countStudentPresent(student, month, academicYear);
            long total = attendanceRepository.countStudentTotal(student, month, academicYear);

            // 3. Calculate Percentage (handling division by zero)
            int percentage = 0;
            if (total > 0) {
                percentage = (int) Math.round((double) present * 100 / total);
            }

            // 4. Map data for Frontend
            Map<String, Object> data = new HashMap<>();
            data.put("rollNumber", student.getRollNumber());

            // Handle potential null users or names
            String name = "Unknown";
            if (student.getUser() != null && student.getUser().getFullName() != null) {
                name = student.getUser().getFullName();
            }
            data.put("fullName", name);

            data.put("percentage", percentage);
            summaryList.add(data);
        }

        return summaryList;
    }

    public Map<String, Object> getAttendanceGrid(Integer academicYear, String division, int month, int calYear,
            String start, String end) {
        List<StudentProfile> students = studentRepository.findByYearAndDivision(academicYear, division);

        // 1. Determine the Date Range
        LocalDate from = (start != null && !start.isEmpty()) ? LocalDate.parse(start) : LocalDate.of(calYear, month, 1);
        LocalDate to = (end != null && !end.isEmpty()) ? LocalDate.parse(end)
                : from.withDayOfMonth(from.lengthOfMonth());

        // 2. Get only the dates within this specific range that have records
        List<LocalDate> activeDates = attendanceRepository.findActiveDatesInRange(division, from, to);
        List<Integer> days = activeDates.stream()
                .map(LocalDate::getDayOfMonth)
                .sorted()
                .toList();

        List<Map<String, Object>> studentRows = new ArrayList<>();
        for (StudentProfile s : students) {
            Map<String, Object> row = new HashMap<>();
            row.put("rollNumber", s.getRollNumber());
            row.put("fullName", s.getUser() != null ? s.getUser().getFullName() : "Unknown");

            // 3. FIX: Fetch records specifically between the 'from' and 'to' dates
            List<Attendance> records = attendanceRepository.findByStudentAndDateBetween(s, from, to);

            Map<Integer, String> dailyStatus = new HashMap<>();
            for (Attendance a : records) {
                dailyStatus.put(a.getDate().getDayOfMonth(), a.isPresent() ? "P" : "A");
            }

            row.put("dailyAttendance", dailyStatus);

            // 4. Calculate percentage based ONLY on the filtered range
            long present = records.stream().filter(Attendance::isPresent).count();
            int pct = records.isEmpty() ? 0 : (int) Math.round((double) present * 100 / records.size());
            row.put("percentage", pct);

            studentRows.add(row);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("dates", days);
        result.put("students", studentRows);
        return result;
    }

    public List<Map<String, Object>> getDailyStatusList(Integer year, String division, String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        List<StudentProfile> students = studentRepository.findByYearAndDivision(year, division);

        List<Map<String, Object>> result = new ArrayList<>();
        for (StudentProfile s : students) {
            Map<String, Object> map = new HashMap<>();
            map.put("rollNumber", s.getRollNumber());

            String fullName = "Unknown";
            if (s.getUser() != null) {
                fullName = s.getUser().getFullName();
            }
            map.put("fullName", fullName);

            // Fetch specific record
            Optional<Attendance> record = attendanceRepository.findByStudentAndDate(s, date);

            if (record.isPresent()) {
                boolean present = record.get().isPresent();
                map.put("status", present ? "Present" : "Absent");
                map.put("statusColor", present ? "#10b981" : "#ef4444");
            } else {
                // Very important: Fallback if no attendance was taken that day
                map.put("status", "Not Marked");
                map.put("statusColor", "#64748b");
            }

            result.add(map);
        }
        return result;
    }
}