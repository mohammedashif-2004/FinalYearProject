package com.bcaportal.bcaportal.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import com.bcaportal.bcaportal.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bcaportal.bcaportal.repository.TimetableRepository;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor // This handles the constructor for you
@CrossOrigin(origins = "*")
public class TeacherPortalController {

    private final TeacherRepository teacherRepository;
    private final TimetableRepository timetableRepository;

    @GetMapping("/my-assignments")
    public ResponseEntity<?> getMyAssignments(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        return teacherRepository.findByOfficialEmail(principal.getName())
                .map(teacher -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("fullName", teacher.getFullName());

                    // We now return the list of assignments from the new table
                    response.put("assignments", teacher.getAssignments());

                    return ResponseEntity.ok((Object) response);
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Profile not found"));
    }

    @GetMapping("/admin/all-with-live-assignments")
    public ResponseEntity<?> getAllWithAssignments() {
        return ResponseEntity.ok(teacherRepository.findAll().stream().map(teacher -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", teacher.getId());
            map.put("employeeCode", teacher.getEmployeeCode());
            map.put("fullName", teacher.getFullName());

            // This is the professional way: Fetch live from Timetable
            List<String> liveAssignments = timetableRepository.findActiveAssignmentsByTeacherId(teacher.getId());
            map.put("assignments", liveAssignments);

            return map;
        }).collect(Collectors.toList()));
    }
}