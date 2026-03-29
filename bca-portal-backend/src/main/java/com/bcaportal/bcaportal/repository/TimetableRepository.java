package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {
    
    // This allows the conflict check to work automatically
    boolean existsByTeacherIdAndDayAndTimeSlot(Long teacherId, String day, String timeSlot);
}