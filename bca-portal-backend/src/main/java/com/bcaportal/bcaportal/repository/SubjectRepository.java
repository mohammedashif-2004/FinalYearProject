package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByYear(String year);
}