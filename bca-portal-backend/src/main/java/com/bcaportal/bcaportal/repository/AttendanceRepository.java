package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.Attendance;
import com.bcaportal.bcaportal.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
        

        @Query("SELECT a FROM Attendance a WHERE a.student.year = :year AND a.student.division = :division")
        List<Attendance> findByYearAndDivision(@Param("year") Integer year, @Param("division") String division);

        Optional<Attendance> findByStudentAndDate(StudentProfile student, LocalDate date);

        // ✅ KEEP THIS ONE (It uses the custom SQL to find division inside student)
        @Query("SELECT a FROM Attendance a WHERE a.year = :year AND a.date = :date AND a.student.division = :division")
        List<Attendance> findByYearAndDateAndDivision(
                        @Param("year") Integer year,
                        @Param("date") LocalDate date,
                        @Param("division") String division);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.present = true")
        long countTotalPresentDays(@Param("studentId") Long studentId);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
        long countTotalDaysMarked(@Param("studentId") Long studentId);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.division = :division " +
                        "AND a.month = :month AND a.year = :year AND a.present = true")
        long countPresentDays(@Param("division") String division, @Param("month") int month, @Param("year") int year);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.division = :division " +
                        "AND a.month = :month AND a.year = :year")
        long countTotalDays(@Param("division") String division, @Param("month") int month, @Param("year") int year);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
                        "AND a.month = :month AND a.year = :year")
        long countStudentTotal(@Param("student") StudentProfile student,
                        @Param("month") int month,
                        @Param("year") int year);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student " +
                        "AND a.month = :month AND a.year = :year AND a.present = true")
        long countStudentPresent(@Param("student") StudentProfile student,
                        @Param("month") int month,
                        @Param("year") int year);

        // Inside AttendanceRepository.java

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.division = :division " +
                        "AND a.month = :month AND a.year = :year AND a.present = true")
        long countPresentByDivision(@Param("division") String division,
                        @Param("month") int month,
                        @Param("year") int year);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.division = :division " +
                        "AND a.month = :month AND a.year = :year")
        long countTotalByDivision(@Param("division") String division,
                        @Param("month") int month,
                        @Param("year") int year);

        @Query("SELECT a FROM Attendance a WHERE a.student.division = :division " +
                        "AND a.month = :month AND a.year = :year")
        List<Attendance> findMonthlyRecords(@Param("division") String division,
                        @Param("month") int month,
                        @Param("year") int year);

        @Query("SELECT DISTINCT a.date FROM Attendance a " +
                        "WHERE a.student.division = :division AND a.month = :month AND a.year = :year")
        List<LocalDate> findActiveDates(@Param("division") String division,
                        @Param("month") int month,
                        @Param("year") int year);

        // 2. Find all records for a specific student in a month
        List<Attendance> findByStudentAndMonthAndYear(StudentProfile student, int month, int year);

        List<Attendance> findByStudentAndDateBetween(StudentProfile student, LocalDate start, LocalDate end);

        @Query("SELECT DISTINCT a.date FROM Attendance a WHERE a.student.division = :division AND a.date BETWEEN :start AND :end")
        List<LocalDate> findActiveDatesInRange(@Param("division") String division, @Param("start") LocalDate start,
                        @Param("end") LocalDate end);

}