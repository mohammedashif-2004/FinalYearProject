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
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            var user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // Bulk Upload Permissions
                        .requestMatchers(HttpMethod.POST, "/api/admin/students/bulk-upload/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/admin/students/check-duplicates/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")

                        // Attendance Permissions
                        // Inside your filterChain method
                        .requestMatchers(HttpMethod.GET, "/api/teacher/attendance/check").hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/teacher/attendance/save").hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/admin/students/attendance-list").hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/teacher/attendance/check/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/teacher/attendance/save/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/admin/students/attendance-list/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
                        // Inside your filterChain method
                        // General Rules
                        .requestMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
                        .requestMatchers("/api/teacher/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
                        .requestMatchers("/api/teacher/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_ADMIN")
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