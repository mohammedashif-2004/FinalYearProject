package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.entity.TimetableEntry;
import com.bcaportal.bcaportal.repository.TimetableRepository;
import com.bcaportal.bcaportal.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.bcaportal.bcaportal.entity.TeacherProfile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/timetable")
// TO THIS (Allow both roles at the class level):
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
@CrossOrigin(origins = "*")
public class TimetableController {

    private final TimetableRepository timetableRepository;
    private final TeacherRepository teacherRepository;

    public TimetableController(TimetableRepository timetableRepository, TeacherRepository teacherRepository) {
        this.timetableRepository = timetableRepository;
        this.teacherRepository = teacherRepository;
    }

    @GetMapping("/all")
    public List<TimetableEntry> getAll() {
        return timetableRepository.findAll();
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveEntry(@RequestBody Map<String, Object> data) {
        try {
            TimetableEntry entry = new TimetableEntry();
            // ... (your existing setters)
            entry.setDay((String) data.get("day"));
            entry.setTimeSlot((String) data.get("timeSlot"));
            entry.setSubject((String) data.get("subject"));
            entry.setType((String) data.get("type"));
            entry.setRoom((String) data.get("room"));
            entry.setClassName((String) data.get("className"));
            entry.setDivision((String) data.get("division"));

            Object tId = data.get("teacherId");
            if (tId != null && !tId.toString().isEmpty()) {
                Long teacherId = Long.parseLong(tId.toString());

                // Conflict Check
                if (timetableRepository.existsByTeacherIdAndDayAndTimeSlot(teacherId, entry.getDay(),
                        entry.getTimeSlot())) {
                    return ResponseEntity.status(409).body("Teacher is already busy during this slot!");
                }

                // Link Teacher
                teacherRepository.findById(teacherId).ifPresent(entry::setTeacher);
            }

            timetableRepository.save(entry);
            return ResponseEntity.ok("Session saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        timetableRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    // In TimetableController.java
    @GetMapping("/teachers-with-assignments")
    public ResponseEntity<?> getTeachersWithAssignments() {
        // ADD THIS LINE
        System.out.println("USER AUTHORITIES: " + org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getAuthorities());

        List<TeacherProfile> teachers = teacherRepository.findAll();

        List<Map<String, Object>> response = teachers.stream().map(teacher -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", teacher.getId());
            map.put("employeeCode", teacher.getEmployeeCode());
            map.put("fullName", teacher.getFullName());

            // 2. Fetch live assignments from the repository
            List<String> liveAssignments = timetableRepository.findActiveAssignmentsByTeacherId(teacher.getId());
            map.put("assignments", liveAssignments);

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}