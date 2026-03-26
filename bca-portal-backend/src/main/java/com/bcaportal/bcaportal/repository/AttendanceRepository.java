package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.Attendance;
import com.bcaportal.bcaportal.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentAndDate(StudentProfile student, LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.present = true")
    long countTotalPresentDays(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalDaysMarked(@Param("studentId") Long studentId);

    // Existing month-based methods for reports
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
            "AND a.month = :month AND a.year = :year AND a.present = true")
    long countPresentDays(@Param("student") StudentProfile student, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
            "AND a.month = :month AND a.year = :year")
    long countTotalDays(@Param("student") StudentProfile student, @Param("month") int month, @Param("year") int year);
}