package com.bcaportal.bcaportal.service;

import lombok.extern.slf4j.Slf4j;
import com.bcaportal.bcaportal.dto.AttendanceRequest;
import com.bcaportal.bcaportal.entity.Attendance;
import com.bcaportal.bcaportal.repository.AttendanceRepository;
import com.bcaportal.bcaportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
                    rollNumber, request.getYear(), request.getDivision()
            ).ifPresent(student -> {
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
}