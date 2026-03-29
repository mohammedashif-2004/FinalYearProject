package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.entity.Subject;
import com.bcaportal.bcaportal.repository.SubjectRepository;    
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/admin/subjects")
@PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN')")
public class SubjectController {
    
    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/all")
    public List<Subject> getAll() {
        return subjectRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSubject(@RequestBody Subject subject) {
        subjectRepository.save(subject);
        return ResponseEntity.ok("Subject Added!");
    }

    @DeleteMapping("/{id}")
@PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN')")
public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
    try {
        subjectRepository.deleteById(id);
        return ResponseEntity.ok("Subject deleted successfully");
    } catch (Exception e) {
        return ResponseEntity.status(400).body("Error deleting subject");
    }
}
}