package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.StudentRequest;
import com.bcaportal.bcaportal.dto.StudentResponse;
import com.bcaportal.bcaportal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

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
    public ResponseEntity<List<StudentResponse>> getByDivision(@RequestParam Integer year, @RequestParam String division) {
        return ResponseEntity.ok(studentService.getStudentsByDivision(year, division));
    }

    @PostMapping("/check-duplicates")
    public ResponseEntity<List<String>> checkDuplicates(@RequestBody List<String> prNumbers) {
        List<String> existing = prNumbers.stream().filter(pr -> {
            try { return studentService.getStudentByPrNumber(pr) != null; } 
            catch (Exception e) { return false; }
        }).collect(Collectors.toList());
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/all")
    public ResponseEntity<String> deleteAll() {
        studentService.deleteAllStudents();
        return ResponseEntity.ok("Cleared");
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAll() { return ResponseEntity.ok(studentService.getAllStudents()); }

    @PostMapping
    public ResponseEntity<StudentResponse> add(@RequestBody StudentRequest r) { return ResponseEntity.ok(studentService.addStudent(r)); }
}