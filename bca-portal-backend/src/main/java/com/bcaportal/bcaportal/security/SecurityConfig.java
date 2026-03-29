package com.bcaportal.bcaportal.security;

import com.bcaportal.bcaportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserRepository userRepository;

    @Bean
public UserDetailsService userDetailsService() {
    return username -> {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        // 1. Get the role name from the database (e.g., "SUPER_ADMIN" or "ROLE_SUPER_ADMIN")
        String roleName = user.getRole().name();
        
        // 2. Format it safely: only add "ROLE_" if it's missing
        String finalRole = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
        
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(finalRole))); // 3. Use the finalRole here
    };
}

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // 1. Public endpoints
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/auth/**").permitAll()

            // 2. TIMETABLE: Only Super Admin (Must be above general /api/admin/**)
            .requestMatchers("/api/admin/timetable/**").hasAnyAuthority("ROLE_SUPER_ADMIN")

            // 3. STUDENTS: Admin & Super Admin
            .requestMatchers("/api/admin/students/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")

            // 4. TEACHER ATTENDANCE: Public bypass for debugging (optional)
            .requestMatchers("/api/teacher/attendance/daily-status").permitAll()
            
            // 5. ATTENDANCE: Specific Teacher Rules
            .requestMatchers("/api/teacher/attendance/**").hasAnyAuthority("ROLE_TEACHER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN")

            // 6. GENERAL ADMIN: Everything else under /api/admin
            .requestMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")

            // 7. GENERAL TEACHER: Everything else under /api/teacher
            .requestMatchers("/api/teacher/**").hasAnyAuthority("ROLE_TEACHER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN")

            // 8. CATCH-ALL
            .anyRequest().authenticated())
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}