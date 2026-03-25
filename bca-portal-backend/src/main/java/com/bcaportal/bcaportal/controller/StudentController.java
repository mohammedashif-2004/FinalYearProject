package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.StudentRequest;
import com.bcaportal.bcaportal.dto.StudentResponse;
import com.bcaportal.bcaportal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    // Add student
    @PostMapping
    public ResponseEntity<StudentResponse> addStudent(@RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.addStudent(request));
    }

    // Get all students
    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Get students by year and division
    @GetMapping("/division")
    public ResponseEntity<List<StudentResponse>> getByDivision(
            @RequestParam Integer year,
            @RequestParam String division) {
        return ResponseEntity.ok(studentService.getStudentsByDivision(year, division));
    }

    // Get student by PR number
    @GetMapping("/{prNumber}")
    public ResponseEntity<StudentResponse> getByPrNumber(@PathVariable String prNumber) {
        return ResponseEntity.ok(studentService.getStudentByPrNumber(prNumber));
    }

    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.deleteStudent(id));
    }
}