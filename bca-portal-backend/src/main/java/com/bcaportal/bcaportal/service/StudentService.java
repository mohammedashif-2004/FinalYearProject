package com.bcaportal.bcaportal.service;

import com.bcaportal.bcaportal.dto.StudentRequest;
import com.bcaportal.bcaportal.dto.StudentResponse;
import com.bcaportal.bcaportal.entity.StudentProfile;
import com.bcaportal.bcaportal.entity.User;
import com.bcaportal.bcaportal.entity.User.Role;
import com.bcaportal.bcaportal.repository.StudentRepository;
import com.bcaportal.bcaportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public String importStudentsFromExcel(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            int count = 0;
            int skipped = 0;
            DataFormatter formatter = new DataFormatter();

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (currentRow.getRowNum() == 0 || isRowEmpty(currentRow)) continue;

                try {
                    String fullName = formatter.formatCellValue(currentRow.getCell(1)).trim();
                    String prNumber = formatter.formatCellValue(currentRow.getCell(2)).trim();
                    String rollNumber = formatter.formatCellValue(currentRow.getCell(3)).trim();
                    int yearVal = parseYear(currentRow.getCell(4), formatter);
                    String division = formatter.formatCellValue(currentRow.getCell(5)).trim().toUpperCase();
                    String sPhone = (currentRow.getCell(6) != null) ? formatter.formatCellValue(currentRow.getCell(6)).trim() : "";
                    String pPhone = (currentRow.getCell(7) != null) ? formatter.formatCellValue(currentRow.getCell(7)).trim() : "";

                    if (prNumber.isEmpty()) continue;

                    StudentRequest request = new StudentRequest();
                    request.setUsername(prNumber);
                    request.setPassword(prNumber);
                    request.setFullName(fullName);
                    request.setPrNumber(prNumber);
                    request.setRollNumber(rollNumber);
                    request.setYear(yearVal);
                    request.setDivision(division);
                    request.setPhoneNumber(sPhone);
                    request.setParentPhone(pPhone);

                    // If addStudent returns null, it means it was a duplicate and we skip it
                    StudentResponse response = this.addStudent(request);
                    if (response != null) {
                        count++;
                    } else {
                        skipped++;
                    }
                } catch (Exception e) {
                    log.error("Error Row {}: {}", currentRow.getRowNum(), e.getMessage());
                }
            }
            return String.format("Upload Complete: %d saved, %d duplicates skipped.", count, skipped);
        }
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        Cell cell = row.getCell(1);
        return cell == null || cell.getCellType() == CellType.BLANK;
    }

    private int parseYear(Cell cell, DataFormatter formatter) {
        if (cell == null) return 1;
        if (cell.getCellType() == CellType.NUMERIC) return (int) cell.getNumericCellValue();
        String val = formatter.formatCellValue(cell).trim();
        return val.isEmpty() ? 1 : Integer.parseInt(val);
    }

    @Transactional
    public StudentResponse addStudent(StudentRequest request) {
        // 1. Check if Username/PRN already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            log.warn("Duplicate found: PR Number {} already exists. Skipping...", request.getUsername());
            return null; 
        }

        // 2. Check if Roll Number already exists in the same Year and Division
        // Note: You must add this method to your StudentRepository interface
        if (studentRepository.existsByRollNumberAndYearAndDivision(
                request.getRollNumber(), request.getYear(), request.getDivision())) {
            log.warn("Duplicate found: Roll Number {} in Year {} Div {} already exists. Skipping...", 
                    request.getRollNumber(), request.getYear(), request.getDivision());
            return null;
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
        profile.setParentPhone(request.getParentPhone());
        studentRepository.save(profile);
        return mapToResponse(profile);
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<StudentResponse> getStudentsByDivision(Integer year, String division) {
        return studentRepository.findByYearAndDivision(year, division).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public StudentResponse getStudentByPrNumber(String prNumber) {
        return studentRepository.findByPrNumber(prNumber).map(this::mapToResponse).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @Transactional
    public void deleteAllStudents() {
        List<StudentProfile> students = studentRepository.findAll();
        List<Long> userIds = students.stream()
                .map(StudentProfile::getUser)
                .filter(u -> u != null && u.getRole() == Role.STUDENT)
                .map(User::getId)
                .collect(Collectors.toList());
        studentRepository.deleteAll();
        if (!userIds.isEmpty()) userRepository.deleteAllById(userIds);
    }

    private StudentResponse mapToResponse(StudentProfile p) {
        return new StudentResponse(p.getId(), p.getUser().getFullName(), p.getUser().getUsername(), p.getPrNumber(), p.getRollNumber(), p.getPhoneNumber(), p.getYear(), p.getDivision(), p.getParentName(), p.getParentPhone());
    }

    public String deleteStudent(Long id) {
        StudentProfile p = studentRepository.findById(id).orElseThrow();
        studentRepository.delete(p);
        userRepository.delete(p.getUser());
        return "Deleted";
    }
}