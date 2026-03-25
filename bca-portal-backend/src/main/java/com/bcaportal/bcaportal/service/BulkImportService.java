package com.bcaportal.bcaportal.service;

import com.bcaportal.bcaportal.dto.BulkStudentRequest;
import com.bcaportal.bcaportal.dto.BulkTeacherRequest;
import com.bcaportal.bcaportal.entity.StudentProfile;
import com.bcaportal.bcaportal.entity.TeacherProfile;
import com.bcaportal.bcaportal.repository.StudentRepository;
import com.bcaportal.bcaportal.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BulkImportService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    // ── JSON bulk insert ───────────────────────────────────────────────────────

    public String bulkInsertStudents(BulkStudentRequest request) {
        List<StudentProfile> toSave = new ArrayList<>();
        for (BulkStudentRequest.StudentEntry entry : request.getStudents()) {
            if (studentRepository.findByPrNumber(entry.getPrNumber()).isPresent()) continue;
            StudentProfile p = new StudentProfile();
            p.setSrNo(entry.getSrNo());
            p.setFullName(entry.getFullName());
            p.setGender(entry.getGender());
            p.setCategory(entry.getCategory());
            p.setStateOfDomicile(entry.getStateOfDomicile());
            p.setNationality(entry.getNationality());
            p.setEmail(entry.getEmail());
            p.setProgramName(entry.getProgramName());
            p.setEnrollmentId(entry.getEnrollmentId());
            p.setYearOfJoining(entry.getYearOfJoining());
            p.setPrNumber(entry.getPrNumber());
            p.setYear(entry.getYear());
            p.setDivision(entry.getDivision());
            p.setRollNumber(entry.getRollNumber());
            p.setPhoneNumber(entry.getPhoneNumber());
            p.setParentName(entry.getParentName());
            p.setParentPhone(entry.getParentPhone());
            toSave.add(p);
        }
        studentRepository.saveAll(toSave);
        return "Inserted " + toSave.size() + " students successfully!";
    }

    public String bulkInsertTeachers(BulkTeacherRequest request) {
        List<TeacherProfile> toSave = new ArrayList<>();
        for (BulkTeacherRequest.TeacherEntry entry : request.getTeachers()) {
            TeacherProfile p = new TeacherProfile();
            p.setEmployeeCode(entry.getEmployeeCode());
            p.setFullName(entry.getFullName());
            p.setEmployeeType(entry.getEmployeeType());
            p.setOfficialEmail(entry.getOfficialEmail());
            p.setMobileNumber(entry.getMobileNumber());
            p.setOrganizationUnit(entry.getOrganizationUnit());
            p.setDesignation(entry.getDesignation());
            p.setSubjectSpecialization(entry.getSubjectSpecialization());
            p.setGender(entry.getGender());
            p.setAppointedCategory(entry.getAppointedCategory());
            p.setPwd(entry.getPwd());
            p.setBloodGroup(entry.getBloodGroup());
            p.setDateOfBirth(entry.getDateOfBirth());
            p.setNationality(entry.getNationality());
            p.setPermanentState(entry.getPermanentState());
            p.setAssignedYear(entry.getAssignedYear());
            p.setAssignedDivision(entry.getAssignedDivision());
            p.setAssignedSubject(entry.getAssignedSubject());
            toSave.add(p);
        }
        teacherRepository.saveAll(toSave);
        return "Inserted " + toSave.size() + " teachers successfully!";
    }

    // ── Excel Upload: Students ─────────────────────────────────────────────────

    public String uploadStudentsFromExcel(MultipartFile file) throws Exception {
        List<StudentProfile> toSave = new ArrayList<>();
        int skipped = 0;

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            boolean firstRow = true;

            for (Row row : sheet) {
                if (firstRow) { firstRow = false; continue; }
                if (row.getCell(0) == null || getCellValue(row, 0).isBlank()) continue;

                String prNumber = getCellValue(row, 10); // PR NO is col 10
                if (studentRepository.findByPrNumber(prNumber).isPresent()) {
                    skipped++;
                    continue;
                }

                StudentProfile p = new StudentProfile();
                p.setSrNo(getCellValue(row, 0));             // SR NO
                p.setFullName(getCellValue(row, 1));         // Name
                p.setGender(getCellValue(row, 2));           // Gender
                p.setCategory(getCellValue(row, 3));         // Category
                p.setStateOfDomicile(getCellValue(row, 4)); // State
                p.setNationality(getCellValue(row, 5));      // Nationality
                p.setEmail(getCellValue(row, 6));            // Email
                p.setProgramName(getCellValue(row, 7));      // Program name
                p.setRollNumber(getCellValue(row, 8));       // Roll No
                p.setYearOfJoining(parseIntCell(row, 9));   // Year of Joining
                p.setPrNumber(prNumber);                     // PR NO (col 10)
                p.setEnrollmentId(null);                     // Not in Excel
                p.setYear(parseIntCell(row, 11));            // Year 1/2/3
                p.setDivision(getCellValue(row, 12));        // Division A/B
                p.setPhoneNumber(getCellValue(row, 13));     // Phone Number
                p.setParentPhone(getCellValue(row, 14));     // Parent Phone

                toSave.add(p);
            }
        }

        studentRepository.saveAll(toSave);
        return "Inserted " + toSave.size() + " students successfully! Skipped " + skipped + " duplicates.";
    }

    // ── Excel Upload: Teachers ─────────────────────────────────────────────────

    public String uploadTeachersFromExcel(MultipartFile file) throws Exception {
        List<TeacherProfile> toSave = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            boolean firstRow = true;

            for (Row row : sheet) {
                if (firstRow) { firstRow = false; continue; }
                if (row.getCell(0) == null || getCellValue(row, 0).isBlank()) continue;

                TeacherProfile p = new TeacherProfile();
                p.setEmployeeCode(getCellValue(row, 0));          // Employee Code
                p.setFullName(getCellValue(row, 1));              // Name
                p.setEmployeeType(getCellValue(row, 2));          // Type
                p.setOfficialEmail(getCellValue(row, 3));         // Email
                p.setMobileNumber(getCellValue(row, 4));          // Mobile
                p.setOrganizationUnit(getCellValue(row, 5));      // Org Unit
                p.setDesignation(getCellValue(row, 6));           // Designation
                p.setSubjectSpecialization(getCellValue(row, 7)); // Subject
                p.setGender(getCellValue(row, 8));                // Gender
                p.setAppointedCategory(getCellValue(row, 9));     // Category
                p.setPwd(getCellValue(row, 10));                  // PWD
                p.setBloodGroup(getCellValue(row, 11));           // Blood Group
                p.setDateOfBirth(getCellValue(row, 12));          // DOB
                p.setNationality(getCellValue(row, 13));          // Nationality
                p.setPermanentState(getCellValue(row, 14));       // State

                toSave.add(p);
            }
        }

        teacherRepository.saveAll(toSave);
        return "Inserted " + toSave.size() + " teachers successfully!";
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String getCellValue(Row row, int colIndex) {
        Cell cell = row.getCell(colIndex);
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                yield String.valueOf((long) cell.getNumericCellValue());
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private Integer parseIntCell(Row row, int colIndex) {
        String val = getCellValue(row, colIndex);
        if (val == null || val.isBlank()) return null;
        try { return Integer.parseInt(val); }
        catch (NumberFormatException e) { return null; }
    }
}