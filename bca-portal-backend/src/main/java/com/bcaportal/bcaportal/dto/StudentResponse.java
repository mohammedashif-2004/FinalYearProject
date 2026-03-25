package com.bcaportal.bcaportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private String fullName;
    private String username;
    private String prNumber;
    private String rollNumber;
    private String phoneNumber;
    private Integer year;
    private String division;
    private String parentName;
    private String parentPhone;
}