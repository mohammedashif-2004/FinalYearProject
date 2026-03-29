package com.bcaportal.bcaportal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class TimetableEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String day;        // Monday, Tuesday...
    private String timeSlot;   // 08:15 - 09:15
    private String subject;
    private String type;       // Theory, Lab, Tutorial
    private String room;
    private String className;  // FYBCA, SYBCA, TYBCA
    private String division;   // A, B

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private TeacherProfile teacher; // Link to the teacher entity
}