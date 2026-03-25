package com.bcaportal.bcaportal.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkTeacherRequest {
    private List<TeacherEntry> teachers;

    @Data
    public static class TeacherEntry {
        private String employeeCode;
        private String fullName;
        private String employeeType;
        private String officialEmail;
        private String mobileNumber;
        private String organizationUnit;
        private String designation;
        private String subjectSpecialization;
        private String gender;
        private String appointedCategory;
        private String pwd;
        private String bloodGroup;
        private String dateOfBirth;
        private String nationality;
        private String permanentState;
        private Integer assignedYear;
        private String assignedDivision;
        private String assignedSubject;
    }
}