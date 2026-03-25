package com.bcaportal.bcaportal.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bcaportal.bcaportal.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}