package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentProfile, Long> {
    List<StudentProfile> findByYearAndDivision(Integer year, String division);
    Optional<StudentProfile> findByPrNumber(String prNumber);
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByRollNumberAndYearAndDivision(
            String rollNumber, Integer year, String division);
}