package com.bcaportal.bcaportal.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import com.bcaportal.bcaportal.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor // This handles the constructor for you
@CrossOrigin(origins = "*")
public class TeacherPortalController {

    private final TeacherRepository teacherRepository;

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
}