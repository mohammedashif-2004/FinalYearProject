package com.bcaportal.bcaportal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                if (jwtUtil.validateToken(token)) {
                    String username = jwtUtil.extractUsername(token);
                    String role = jwtUtil.extractRole(token); 

                    // 1. FORMAT THE ROLE: Ensure it always has ROLE_ prefix
                    // This is the fix for the 403 Forbidden error
                    String formattedRole = (role != null && !role.startsWith("ROLE_")) ? "ROLE_" + role : role;

                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        // 2. CREATE AUTHENTICATION: Pass the formatted role as an authority
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                username, 
                                null, 
                                List.of(new SimpleGrantedAuthority(formattedRole))
                        );
                        
                        // 3. SET DETAILS: Important for Spring Security's internal logging
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        // DEBUG: Uncomment the next line to see the authority in your IntelliJ console
                        // System.out.println("User: " + username + " authenticated with: " + formattedRole);
                    }
                }
            } catch (Exception e) {
                // If token is invalid or expired, clear context
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}