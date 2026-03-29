package com.bcaportal.bcaportal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;


@Entity
@Table(name = "subjects", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "year"})
})
@Data
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String year;
    
    // courseCode if you still want it
    private String courseCode;
}