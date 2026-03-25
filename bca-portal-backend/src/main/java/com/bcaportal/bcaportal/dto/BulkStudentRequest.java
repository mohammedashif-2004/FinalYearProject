package com.bcaportal.bcaportal.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkStudentRequest {
    private List<StudentEntry> students;

    @Data
    public static class StudentEntry {
        private String srNo;
        private String fullName;
        private String gender;
        private String category;
        private String stateOfDomicile;
        private String nationality;
        private String email;
        private String programName;
        private String enrollmentId;
        private Integer yearOfJoining;
        private String prNumber;
        private Integer year;
        private String division;
        private String rollNumber;
        private String phoneNumber;
        private String parentName;
        private String parentPhone;
    }
}