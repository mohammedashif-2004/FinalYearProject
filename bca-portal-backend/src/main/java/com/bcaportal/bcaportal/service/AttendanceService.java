package com.bcaportal.bcaportal.service;

import com.bcaportal.bcaportal.dto.AttendanceRequest;
import com.bcaportal.bcaportal.dto.AttendanceResponse;
import com.bcaportal.bcaportal.entity.Attendance;
import com.bcaportal.bcaportal.entity.StudentProfile;
import com.bcaportal.bcaportal.repository.AttendanceRepository;
import com.bcaportal.bcaportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
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
                attendance.setYear(request.getDate().getYear());
                
                attendanceRepository.save(attendance);
            });
        });

        return "Attendance marked successfully!";
    }

    public List<AttendanceResponse> getMonthlyReport(Integer year, String division, Integer month, Integer acadYear) {
        List<StudentProfile> students = studentRepository.findByYearAndDivision(year, division);
        List<AttendanceResponse> report = new ArrayList<>();

        for (StudentProfile student : students) {
            long totalDays = attendanceRepository.countTotalDays(student, month, acadYear);
            long presentDays = attendanceRepository.countPresentDays(student, month, acadYear);
            double percentage = totalDays == 0 ? 0 : Math.round((presentDays * 100.0 / totalDays) * 10.0) / 10.0;
            report.add(new AttendanceResponse(student.getPrNumber(), student.getUser().getFullName(), (int) totalDays, (int) presentDays, percentage, percentage >= 75 ? "GOOD" : "LOW"));
        }
        return report;
    }

    public AttendanceResponse getStudentAttendance(String prNumber, Integer month, Integer year) {
        StudentProfile student = studentRepository.findByPrNumber(prNumber).orElseThrow(() -> new RuntimeException("Student not found!"));
        long totalDays = attendanceRepository.countTotalDays(student, month, year);
        long presentDays = attendanceRepository.countPresentDays(student, month, year);
        double percentage = totalDays == 0 ? 0 : Math.round((presentDays * 100.0 / totalDays) * 10.0) / 10.0;
        return new AttendanceResponse(student.getPrNumber(), student.getUser().getFullName(), (int) totalDays, (int) presentDays, percentage, percentage >= 75 ? "GOOD" : "LOW");
    }
}