package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.Attendance;
import com.bcaportal.bcaportal.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Get all attendance for a student in a month
    List<Attendance> findByStudentAndMonthAndYear(
            StudentProfile student, Integer month, Integer year);

    // Get attendance for a student on a specific date
    boolean existsByStudentAndDate(StudentProfile student, LocalDate date);

    // Get all attendance for a division on a date
    List<Attendance> findByStudent_YearAndStudent_DivisionAndDate(
            Integer year, String division, LocalDate date);

    // Count present days for a student in a month
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
            "AND a.month = :month AND a.year = :year AND a.present = true")
    long countPresentDays(@Param("student") StudentProfile student,
                          @Param("month") int month,
                          @Param("year") int year);

    // Count total days marked for a student in a month
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
            "AND a.month = :month AND a.year = :year")
    long countTotalDays(@Param("student") StudentProfile student,
                        @Param("month") int month,
                        @Param("year") int year);
}