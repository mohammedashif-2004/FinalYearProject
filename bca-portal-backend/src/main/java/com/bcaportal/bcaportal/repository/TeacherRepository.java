package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface TeacherRepository extends JpaRepository<TeacherProfile, Long> {
    Optional<TeacherProfile> findByOfficialEmail(String officialEmail);
    Optional<TeacherProfile> findByEmployeeCode(String employeeCode);
}
