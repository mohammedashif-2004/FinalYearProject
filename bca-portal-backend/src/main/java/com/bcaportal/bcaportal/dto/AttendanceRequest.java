package com.bcaportal.bcaportal.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.Map;

@Data
public class AttendanceRequest {
    private Integer year;      // Backend expects 1, 2, or 3
    private String division;   // "A" or "B"
    private LocalDate date;    // "YYYY-MM-DD"
    private Map<String, Boolean> attendance; // Key: rollNumber (String), Value: isPresent (Boolean)
}
