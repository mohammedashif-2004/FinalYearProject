package com.bcaportal.bcaportal.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.Map;

@Data
public class AttendanceRequest {
    private Integer year;
    private String division;
    private LocalDate date;
    private Map<String, Boolean> attendance; // key: rollNumber, value: true/false
}