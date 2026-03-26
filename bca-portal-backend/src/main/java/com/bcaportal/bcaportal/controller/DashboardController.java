package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.repository.StudentRepository;
import com.bcaportal.bcaportal.repository.TeacherRepository;
import com.bcaportal.bcaportal.repository.AttendanceRepository;
import com.bcaportal.bcaportal.repository.NoticeRepository;
import com.bcaportal.bcaportal.entity.Notice;
import com.bcaportal.bcaportal.entity.StudentProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AttendanceRepository attendanceRepository;
    private final NoticeRepository noticeRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalStudents", studentRepository.count());
        stats.put("totalTeachers", teacherRepository.count());

        List<Map<String, Object>> divisions = new ArrayList<>();
        long totalPresent = 0;
        long totalDays = 0;
        int lowAttendance = 0;

        for (int y = 1; y <= 3; y++) {
            for (String d : List.of("A", "B")) {
                List<StudentProfile> students = studentRepository.findByYearAndDivision(y, d);
                long divPresent = 0;
                long divMarked = 0;

                for (StudentProfile s : students) {
                    long p = attendanceRepository.countTotalPresentDays(s.getId());
                    long m = attendanceRepository.countTotalDaysMarked(s.getId());
                    divPresent += p;
                    divMarked += m;

                    if (m > 0 && ((p * 100.0) / m) < 75) lowAttendance++;
                }

                Map<String, Object> divMap = new HashMap<>();
                divMap.put("year", y);
                divMap.put("division", d);
                divMap.put("attendancePercentage", divMarked > 0 ? (int)((divPresent * 100) / divMarked) : 0);
                divisions.add(divMap);

                totalPresent += divPresent;
                totalDays += divMarked;
            }
        }

        stats.put("divisions", divisions);
        stats.put("lowAttendance", lowAttendance);
        stats.put("avgAttendance", totalDays > 0 ? (int)((totalPresent * 100) / totalDays) : 0);

        stats.put("recentActivity", noticeRepository.findAllByOrderByCreatedAtDesc().stream().limit(5).map(n -> {
            Map<String, Object> a = new HashMap<>();
            a.put("title", "Notice: " + n.getTitle());
            a.put("badgeText", n.getType());
            a.put("timeAgo", calculateTime(n.getCreatedAt()));
            a.put("color", "#0d9488");
            return a;
        }).collect(Collectors.toList()));

        return ResponseEntity.ok(stats);
    }

    private String calculateTime(LocalDateTime dt) {
        if (dt == null) return "Just now";
        long mins = ChronoUnit.MINUTES.between(dt, LocalDateTime.now());
        if (mins < 60) return mins + "m ago";
        long hrs = ChronoUnit.HOURS.between(dt, LocalDateTime.now());
        if (hrs < 24) return hrs + "h ago";
        return ChronoUnit.DAYS.between(dt, LocalDateTime.now()) + "d ago";
    }
}