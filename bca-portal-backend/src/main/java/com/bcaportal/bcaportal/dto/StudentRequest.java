package com.bcaportal.bcaportal.dto;

import lombok.Data;

@Data
public class StudentRequest {
    private String username;
    private String password;
    private String fullName;
    private String prNumber;
    private String rollNumber;
    private String phoneNumber;
    private Integer year;
    private String division;
    private String parentName;
    private String parentPhone;
}