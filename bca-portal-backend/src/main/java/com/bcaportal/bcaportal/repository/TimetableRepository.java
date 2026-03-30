package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {
    
    // This allows the conflict check to work
    boolean existsByTeacherIdAndDayAndTimeSlot(Long teacherId, String day, String timeSlot);
    boolean existsByRoomAndDayAndTimeSlot(String room, String day, String timeSlot);

    // This is the query we discussed earlier for the "Professional Live View"
    @Query("SELECT DISTINCT CONCAT(t.subject, ' (', t.className, ')') " +
           "FROM TimetableEntry t WHERE t.teacher.id = :teacherId")
    List<String> findActiveAssignmentsByTeacherId(@Param("teacherId") Long teacherId);
}