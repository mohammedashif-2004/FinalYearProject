package com.bcaportal.bcaportal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/admin/test")
    public String adminTest() {
        return "Admin access granted!";
    }
}