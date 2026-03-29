package com.bcaportal.bcaportal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teacher_profiles")
@Data
public class TeacherProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employeeCode")
    private String employeeCode;

    @Column(name = "fullName")
    private String fullName;

    @Column(name = "employeeType")
    private String employeeType;

    @Column(name = "officialEmail")
    private String officialEmail;

    @Column(name = "mobileNumber")
    private String mobileNumber;

    @Column(name = "organizationUnit")
    private String organizationUnit;

    private String designation;

    @Column(name = "subjectSpecialization")
    private String subjectSpecialization;

    private String gender;

    @Column(name = "appointedCategory")
    private String appointedCategory;

    private String pwd;

    @Column(name = "bloodGroup")
    private String bloodGroup;

    @Column(name = "dateOfBirth")
    private String dateOfBirth;

    private String nationality;

    @Column(name = "permanentState")
    private String permanentState;

    // Portal-specific fields
    // @Column(name = "assignedYear")
    // private Integer assignedYear;

    // @Column(name = "assignedDivision")
    // private String assignedDivision;

    // @Column(name = "assignedSubject")
    // private String assignedSubject;
    // Inside TeacherProfile class
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
private List<SubjectAssignment> assignments = new ArrayList<>();
    

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}