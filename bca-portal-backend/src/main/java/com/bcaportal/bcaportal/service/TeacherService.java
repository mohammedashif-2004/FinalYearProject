package com.bcaportal.bcaportal.service;

import com.bcaportal.bcaportal.entity.TeacherProfile;
import com.bcaportal.bcaportal.entity.User;
import com.bcaportal.bcaportal.entity.User.Role; // Match your inner enum
import com.bcaportal.bcaportal.repository.TeacherRepository;
import com.bcaportal.bcaportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String importTeachers(MultipartFile file) throws Exception {
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        int count = 0;

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            // Mapping based on your provided image
            String empCode = getVal(row.getCell(0));
            String name    = getVal(row.getCell(1));
            String mobile  = getVal(row.getCell(2));
            String type    = getVal(row.getCell(3));
            String email   = getVal(row.getCell(4));

            if (email.isEmpty()) continue;

            // 1. Create/Update User account for login
            User user = userRepository.findByUsername(email).orElse(new User());
            user.setUsername(email);
            user.setFullName(name);
            if (user.getId() == null) {
                user.setPassword(passwordEncoder.encode("teacher@123")); 
                user.setRole(Role.SUBJECT_TEACHER); 
            }
            userRepository.save(user);

            // 2. Create/Update Teacher Profile linked to the User
            TeacherProfile profile = teacherRepository.findByEmployeeCode(empCode)
                    .orElse(new TeacherProfile());
            
            profile.setEmployeeCode(empCode);
            profile.setFullName(name);
            profile.setMobileNumber(mobile);
            profile.setEmployeeType(type);
            profile.setOfficialEmail(email);
            profile.setUser(user); 
            
            teacherRepository.save(profile);
            count++;
        }
        workbook.close();
        return count + " Teachers processed successfully!";
    }

    private String getVal(Cell cell) {
        if (cell == null) return "";
        // Use CellType directly from the enum to avoid switch errors
        if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
            return String.valueOf((long) cell.getNumericCellValue());
        }
        return "";
    }
}