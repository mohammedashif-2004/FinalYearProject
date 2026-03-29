package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.SubjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectAssignmentRepository extends JpaRepository<SubjectAssignment, Long> {
    List<SubjectAssignment> findByTeacherId(Long teacherId);
}