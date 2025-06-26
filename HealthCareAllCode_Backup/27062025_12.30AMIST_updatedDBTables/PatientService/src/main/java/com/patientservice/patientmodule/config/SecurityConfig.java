/*package com.patientservice.patientmodule.config;

import com.patientservice.patientmodule.security.JwtAuthenticationFilter;
import com.patientservice.patientmodule.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Pre-flight
                .requestMatchers(HttpMethod.GET, "/api/countries", "/api/states", "/api/cities", "/api/diseases", "/api/existing-illnesses").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/patients/register","/api/patients/user/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_PATIENT")
                .requestMatchers("/api/patients/list-json","/api/patients/count").hasAnyAuthority("ROLE_ADMIN","ROLE_DOCTOR")
                .requestMatchers("/api/patient-visits/create","/api/patient-visits/patient/**").hasAnyAuthority("ROLE_ADMIN","ROLE_DOCTOR")
                .requestMatchers("/api/patient-visits/my-visits").hasAnyAuthority("ROLE_PATIENT")

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

*/



package com.patientservice.patientmodule.config;

import com.patientservice.patientmodule.security.JwtAuthenticationFilter;
import com.patientservice.patientmodule.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ✅ Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ Allow GETs for reference data (public APIs)
                .requestMatchers(HttpMethod.GET,
                        "/api/countries",
                        "/api/states",
                        "/api/cities",
                        "/api/diseases",
                        "/api/illnesses" // fixed typo from existing-illnesses
                ).permitAll()

                // ✅ ✅ Allow public registration with POST
                .requestMatchers(HttpMethod.POST, "/api/patients/public/register").permitAll() // ✅ FIXED LINE

                // ✅ Auth APIs (login, register)
                .requestMatchers("/api/auth/**").permitAll()

                // ✅ Role-based protected endpoints
                .requestMatchers("/api/patients/register", "/api/patients/user/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_PATIENT")

                .requestMatchers("/api/patients/list-json", "/api/patients/count")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_DOCTOR")

                .requestMatchers("/api/patient-visits/create", "/api/patient-visits/patient/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_DOCTOR")

                .requestMatchers("/api/patient-visits/my-visits")
                    .hasAnyAuthority("ROLE_PATIENT")

                // ✅ All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}


