package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.StudentRequest;
import com.bcaportal.bcaportal.dto.StudentResponse;
import com.bcaportal.bcaportal.entity.StudentProfile;
import com.bcaportal.bcaportal.repository.StudentRepository;
import com.bcaportal.bcaportal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository studentRepository; // Ensure this matches your variable name

    private final StudentService studentService;

    @PostMapping("/bulk-upload")
    public ResponseEntity<String> uploadStudents(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(studentService.importStudentsFromExcel(file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/attendance-list")
    public ResponseEntity<List<StudentResponse>> getByDivision(@RequestParam Integer year,
            @RequestParam String division) {
        return ResponseEntity.ok(studentService.getStudentsByDivision(year, division));
    }

    @PostMapping("/check-duplicates")
    public ResponseEntity<List<String>> checkDuplicates(@RequestBody List<String> prNumbers) {
        List<String> existing = prNumbers.stream().filter(pr -> {
            try {
                return studentService.getStudentByPrNumber(pr) != null;
            } catch (Exception e) {
                return false;
            }
        }).collect(Collectors.toList());
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/all")
    public ResponseEntity<String> deleteAll() {
        studentService.deleteAllStudents();
        return ResponseEntity.ok("Cleared");
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAll() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @PostMapping
    public ResponseEntity<StudentResponse> add(@RequestBody StudentRequest r) {
        return ResponseEntity.ok(studentService.addStudent(r));
    }

    @GetMapping("/filter")
public ResponseEntity<List<Map<String, Object>>> getStudentsByFilter(
        @RequestParam Integer year,
        @RequestParam String division) {
    
    List<StudentProfile> students = studentRepository.findByYearAndDivision(year, division);
    
    List<Map<String, Object>> response = students.stream().map(s -> {
    Map<String, Object> map = new HashMap<>();
    var user = s.getUser(); // Extract user once

    map.put("id", s.getId());
    map.put("rollNumber", s.getRollNumber() != null ? s.getRollNumber() : "N/A");
    map.put("prNumber", s.getPrNumber() != null ? s.getPrNumber() : ""); 
    
    // Name Logic
    String name = s.getFullName();
    if (name == null || name.isEmpty()) {
        name = (user != null) ? user.getFullName() : "N/A";
    }
    map.put("fullName", name);

    // ... other mappings ...

    // Contact Info
    String email = s.getEmail();
    if (email == null || email.isEmpty()) {
        email = (user != null) ? user.getUsername() : "";
    }
    map.put("email", email);
    map.put("phone", s.getPhoneNumber() != null ? s.getPhoneNumber() : "");

    return map;
}).collect(Collectors.toList());

    return ResponseEntity.ok(response);
}

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateStudent(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        studentService.updateStudentDetails(id, updates);
        return ResponseEntity.ok("Student updated successfully");
    }

    @DeleteMapping("/{id}")
public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
    studentService.deleteStudentById(id);
    return ResponseEntity.ok("Student deleted successfully");
}
}