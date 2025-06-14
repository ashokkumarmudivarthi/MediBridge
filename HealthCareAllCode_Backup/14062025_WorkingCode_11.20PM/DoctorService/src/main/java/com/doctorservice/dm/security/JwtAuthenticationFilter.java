package com.doctorservice.dm.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.doctorservice.dm.service.CustomUserDetailsService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // Exclude these endpoints from filtering
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/login") ||
               path.startsWith("/api/public") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        System.out.println("-------------------------------------------------");
        System.out.println("JwtAuthenticationFilter: Starting filter for " + request.getRequestURI());

        String authorizationHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authorizationHeader);

        String jwtToken = null;
        String username = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            System.out.println("Extracted JWT Token: " + jwtToken);

            try {
                username = jwtUtil.extractUsername(jwtToken);
                System.out.println("Extracted Username from Token: " + username);
            } catch (Exception e) {
                System.out.println("Exception while extracting username: " + e.getMessage());
            }
        } else {
            System.out.println("No Bearer token found or invalid format");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("Username is not null and SecurityContext has no authentication");

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            System.out.println("Loaded UserDetails for " + username);
            System.out.println("Authorities: " + userDetails.getAuthorities());

            if (jwtUtil.validateToken(jwtToken, userDetails)) {
                System.out.println("JWT Token is valid");

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                System.out.println("Authentication token created");

                // ✅ Missing line added here:
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authentication set in SecurityContext for user: " + username);
            } else {
                System.out.println("Invalid JWT Token for user: " + username);
            }
        } else {
            if (username == null) {
                System.out.println("Username is null, skipping authentication setup");
            } else {
                System.out.println("Authentication already exists in SecurityContext");
            }
        }

        System.out.println("Continuing filter chain...");
        filterChain.doFilter(request, response);
        System.out.println("JwtAuthenticationFilter: Filter processing completed for " + request.getRequestURI());
        System.out.println("-------------------------------------------------");
    }
}
