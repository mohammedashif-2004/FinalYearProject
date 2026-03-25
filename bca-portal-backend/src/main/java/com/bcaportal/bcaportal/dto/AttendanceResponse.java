package com.bcaportal.bcaportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceResponse {
    private String prNumber;
    private String studentName;
    private int totalDays;
    private int presentDays;
    private double percentage;
    private String status; // "GOOD" or "LOW"
}