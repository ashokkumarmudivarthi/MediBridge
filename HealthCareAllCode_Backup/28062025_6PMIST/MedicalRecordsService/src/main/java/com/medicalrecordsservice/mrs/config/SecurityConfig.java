/*package com.medicalrecordsservice.mrs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.medicalrecordsservice.mrs.security.JwtAuthenticationFilter;
import com.medicalrecordsservice.mrs.service.CustomUserDetailsService;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        System.out.println("SecurityConfig: Constructor called - JwtAuthFilter and UserDetailsService injected");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("SecurityConfig: Starting security filter chain configuration");

        http
            // Disable CSRF for simplicity in API (typical for JWT token based APIs)
            .csrf(csrf -> {
                csrf.disable();
                System.out.println("SecurityConfig: CSRF protection disabled");
            })

            // Authorize requests with detailed log per matcher
            .authorizeHttpRequests(auth -> {
                System.out.println("SecurityConfig: Configuring authorization rules");
               // auth.requestMatchers("/api/medical-records/**").permitAll();
              //  System.out.println("SecurityConfig: /api/auth/login permitted to all");

             //   auth.requestMatchers("/api/medical-records/**").hasAuthority("ROLE_ADMIN");
              //  System.out.println("SecurityConfig: /api/doctor/register restricted to ADMIN role");

                auth.requestMatchers("/api/medical-records","/api/doctors","/api/medical-records/**").hasAnyAuthority("ROLE_DOCTOR", "ROLE_ADMIN");
                System.out.println("SecurityConfig: /api/medical-records/** restricted to DOCTOR or ADMIN or PATIENT roles");

                auth.anyRequest().authenticated();
                System.out.println("SecurityConfig: All other requests require authentication");
            })

            // Stateless session management (no HTTP session)
            .sessionManagement(sess -> {
                sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                System.out.println("SecurityConfig: Session management set to STATELESS");
            })

            // Authentication provider setup (our custom DAO provider)
            .authenticationProvider(authenticationProvider());

        // Add JWT filter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        System.out.println("SecurityConfig: JWT Authentication filter added before UsernamePasswordAuthenticationFilter");

        System.out.println("SecurityConfig: Security filter chain configuration completed");
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        System.out.println("SecurityConfig: Creating DaoAuthenticationProvider with custom UserDetailsService");
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        System.out.println("SecurityConfig: Password encoder set to BCryptPasswordEncoder");
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        System.out.println("SecurityConfig: Creating BCryptPasswordEncoder bean");
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration authConfig) throws Exception {
        System.out.println("SecurityConfig: Creating AuthenticationManager bean");
        return authConfig.getAuthenticationManager();
    }
}
*/


package com.medicalrecordsservice.mrs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.medicalrecordsservice.mrs.security.JwtAuthenticationFilter;
import com.medicalrecordsservice.mrs.service.CustomUserDetailsService;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults()) // ✅ Enable CORS in Spring Security
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/medical-records/**", "/api/doctors/**").hasAnyAuthority("ROLE_PATIENT","ROLE_DOCTOR", "ROLE_ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

