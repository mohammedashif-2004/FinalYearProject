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

    @Column(name = "srNo")
    private String srNo;

    @Column(name = "fullName")
    private String fullName;

    private String gender;
    
    private String category;

    @Column(name = "stateOfDomicile")
    private String stateOfDomicile;

    private String nationality;

    private String email;

    @Column(name = "programName")
    private String programName;

    @Column(name = "enrollmentId")
    private String enrollmentId;

    @Column(name = "yearOfJoining")
    private Integer yearOfJoining;

    @Column(name = "prNumber")
    private String prNumber;

    private Integer year;       // 1, 2, 3
    
    private String division;    // A, B
    
    @Column(name = "rollNumber")
    private String rollNumber;

    @Column(name = "phoneNumber")
    private String phoneNumber;

    @Column(name = "parentName")
    private String parentName;

    @Column(name = "parentPhone")
    private String parentPhone;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}