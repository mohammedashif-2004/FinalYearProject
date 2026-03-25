package com.bcaportal.bcaportal.dto;

import lombok.Data;

@Data
public class NoticeRequest {
    private String title;
    private String message;
    private String type;
}