package com.bcaportal.bcaportal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "student_profiles")
@Data
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String srNo;
    private String fullName;
    private String gender;
    private String category;
    private String stateOfDomicile;
    private String nationality;
    private String email;
    private String programName;
    private String enrollmentId;
    private Integer yearOfJoining;
    private String prNumber;
    private Integer year;       // 1, 2, 3
    private String division;    // A, B
    private String rollNumber;
    private String phoneNumber;
    private String parentName;
    private String parentPhone;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}