package com.bcaportal.bcaportal.repository;

import com.bcaportal.bcaportal.entity.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<TeacherProfile, Long> {
}
