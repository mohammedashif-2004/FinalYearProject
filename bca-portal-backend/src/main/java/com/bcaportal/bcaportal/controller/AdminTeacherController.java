package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.entity.TeacherProfile;
import com.bcaportal.bcaportal.entity.SubjectAssignment;
import com.bcaportal.bcaportal.service.TeacherService;
import com.bcaportal.bcaportal.repository.TeacherRepository;
import com.bcaportal.bcaportal.repository.SubjectAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminTeacherController {

    private final TeacherService teacherService;
    private final TeacherRepository teacherRepository;
    private final SubjectAssignmentRepository assignmentRepository; // Added this

    @PostMapping("/bulk-upload")
    public ResponseEntity<String> uploadTeachers(@RequestParam("file") MultipartFile file) {
        try {
            String result = teacherService.importTeachers(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<TeacherProfile>> getAllTeachers() {
        return ResponseEntity.ok(teacherRepository.findAll());
    }

    // UPDATED: Now creates a NEW assignment entry for a teacher
    @PostMapping("/assign/{id}")
    public ResponseEntity<String> assignSubject(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        return teacherRepository.findById(id).map(teacher -> {
            try {
                SubjectAssignment assignment = new SubjectAssignment();
                assignment.setTeacher(teacher);
                
                Object yearObj = data.get("year");
                if (yearObj != null) {
                    assignment.setAssignedYear(Integer.parseInt(yearObj.toString()));
                }

                assignment.setAssignedDivision((String) data.get("division"));
                assignment.setAssignedSubject((String) data.get("subject"));

                assignmentRepository.save(assignment);
                return ResponseEntity.ok("New assignment added for " + teacher.getFullName());
            } catch (Exception e) {
                return ResponseEntity.status(400).body("Error: " + e.getMessage());
            }
        }).orElse(ResponseEntity.status(404).body("Teacher not found"));
    }

    // New: To delete a specific assignment if added by mistake
    @DeleteMapping("/assignment/{id}")
    public ResponseEntity<String> removeAssignment(@PathVariable Long id) {
        assignmentRepository.deleteById(id);
        return ResponseEntity.ok("Assignment removed");
    }
}