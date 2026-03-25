package com.bcaportal.bcaportal.service;

import com.bcaportal.bcaportal.dto.StudentRequest;
import com.bcaportal.bcaportal.dto.StudentResponse;
import com.bcaportal.bcaportal.entity.StudentProfile;
import com.bcaportal.bcaportal.entity.User;
import com.bcaportal.bcaportal.entity.User.Role;
import com.bcaportal.bcaportal.repository.StudentRepository;
import com.bcaportal.bcaportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public StudentResponse addStudent(StudentRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }
        if (studentRepository.findByPrNumber(request.getPrNumber()).isPresent()) {
            throw new RuntimeException("PR number already exists!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(Role.STUDENT);
        userRepository.save(user);

        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setPrNumber(request.getPrNumber());
        profile.setRollNumber(request.getRollNumber());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setYear(request.getYear());
        profile.setDivision(request.getDivision());
        profile.setParentName(request.getParentName());
        profile.setParentPhone(request.getParentPhone());
        studentRepository.save(profile);

        return mapToResponse(profile);
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StudentResponse> getStudentsByDivision(Integer year, String division) {
        return studentRepository.findByYearAndDivision(year, division)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentByPrNumber(String prNumber) {
        StudentProfile profile = studentRepository.findByPrNumber(prNumber)
                .orElseThrow(() -> new RuntimeException("Student not found!"));
        return mapToResponse(profile);
    }

    public String deleteStudent(Long id) {
        StudentProfile profile = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found!"));
        studentRepository.delete(profile);
        if (profile.getUser() != null) {
            userRepository.delete(profile.getUser());
        }
        return "Student deleted successfully!";
    }

    private StudentResponse mapToResponse(StudentProfile profile) {
        String fullName = profile.getUser() != null
                ? profile.getUser().getFullName()
                : profile.getFullName();
        String username = profile.getUser() != null
                ? profile.getUser().getUsername()
                : profile.getPrNumber();

        return new StudentResponse(
                profile.getId(),
                fullName,
                username,
                profile.getPrNumber(),
                profile.getRollNumber(),
                profile.getPhoneNumber(),
                profile.getYear(),
                profile.getDivision(),
                profile.getParentName(),
                profile.getParentPhone()
        );
    }
}