package com.bcaportal.bcaportal.controller;

import com.bcaportal.bcaportal.dto.NoticeRequest;
import com.bcaportal.bcaportal.dto.NoticeResponse;
import com.bcaportal.bcaportal.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping
    public ResponseEntity<NoticeResponse> createNotice(
            @RequestBody NoticeRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(noticeService.createNotice(request, username));
    }

    @GetMapping
    public ResponseEntity<List<NoticeResponse>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok("Notice deleted successfully");
    }
}