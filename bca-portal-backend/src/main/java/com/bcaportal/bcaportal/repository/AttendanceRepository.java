package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.Attendance;
import com.bcaportal.bcaportal.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentAndDate(StudentProfile student, LocalDate date);

    // ✅ KEEP THIS ONE (It uses the custom SQL to find division inside student)
    @Query("SELECT a FROM Attendance a WHERE a.year = :year AND a.date = :date AND a.student.division = :division")
    List<Attendance> findByYearAndDateAndDivision(
        @Param("year") Integer year, 
        @Param("date") LocalDate date, 
        @Param("division") String division
    );

    // ------------------------------------------------------------------
    // ❌ DELETE the old 'findByYearAndDivisionAndDate' line from here!
    // ------------------------------------------------------------------

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.present = true")
    long countTotalPresentDays(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalDaysMarked(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
           "AND a.month = :month AND a.year = :year AND a.present = true")
    long countPresentDays(@Param("student") StudentProfile student, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
           "AND a.month = :month AND a.year = :year")
    long countTotalDays(@Param("student") StudentProfile student, @Param("month") int month, @Param("year") int year);
}