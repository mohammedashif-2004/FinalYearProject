package com.bcaportal.bcaportal.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoticeResponse {
    private Long id;
    private String title;
    private String message;
    private String type;
    private String createdBy;
    private LocalDateTime createdAt;
}