package com.bcaportal.bcaportal.service;

import com.bcaportal.bcaportal.dto.AuthResponse;
import com.bcaportal.bcaportal.entity.User;
import com.bcaportal.bcaportal.entity.User.Role;
import com.bcaportal.bcaportal.repository.UserRepository;
import com.bcaportal.bcaportal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            return "Username already exists!";
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.SUPER_ADMIN);

        userRepository.save(user);
        return "User registered successfully!";
    }

    public AuthResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        String token = jwtUtil.generateToken(username, user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), username);
    }
}