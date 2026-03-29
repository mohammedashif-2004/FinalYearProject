package com.bcaportal.bcaportal.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "subject_assignments")
@Data
public class SubjectAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assignedYear")
    private Integer assignedYear;

    @Column(name = "assignedDivision")
    private String assignedDivision;

    @Column(name = "assignedSubject")
    private String assignedSubject;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnore // Prevents infinite loops during JSON conversion
    private TeacherProfile teacher;
}