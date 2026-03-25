package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.BulkStudentRequest;
import com.bcaportal.bcaportal.dto.BulkTeacherRequest;
import com.bcaportal.bcaportal.service.BulkImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/bulk")
@RequiredArgsConstructor
public class BulkImportController {

    private final BulkImportService bulkImportService;

    // JSON endpoints
    @PostMapping("/students")
    public ResponseEntity<String> bulkInsertStudents(@RequestBody BulkStudentRequest request) {
        return ResponseEntity.ok(bulkImportService.bulkInsertStudents(request));
    }

    @PostMapping("/teachers")
    public ResponseEntity<String> bulkInsertTeachers(@RequestBody BulkTeacherRequest request) {
        return ResponseEntity.ok(bulkImportService.bulkInsertTeachers(request));
    }

    // Excel upload endpoints
    @PostMapping("/students/upload")
    public ResponseEntity<String> uploadStudents(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(bulkImportService.uploadStudentsFromExcel(file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/teachers/upload")
    public ResponseEntity<String> uploadTeachers(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(bulkImportService.uploadTeachersFromExcel(file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
