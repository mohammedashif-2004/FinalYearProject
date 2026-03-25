package com.bcaportal.bcaportal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "teacher_profiles")
@Data
public class TeacherProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeCode;
    private String fullName;
    private String employeeType;
    private String officialEmail;
    private String mobileNumber;
    private String organizationUnit;
    private String designation;
    private String subjectSpecialization;
    private String gender;
    private String appointedCategory;
    private String pwd;
    private String bloodGroup;
    private String dateOfBirth;
    private String nationality;
    private String permanentState;

    // Portal-specific fields
    private Integer assignedYear;
    private String assignedDivision;
    private String assignedSubject;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}