package com.medibridge.authservice.controller;

import com.medibridge.authservice.dto.LoginRequest;
import com.medibridge.authservice.dto.LoginResponse;
import com.medibridge.authservice.model.User;
import com.medibridge.authservice.repository.UserRepository;
import com.medibridge.authservice.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserRepository userRepo) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Attempting to authenticate user: " + request.getUsername());

            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            System.out.println("Authentication successful for: " + request.getUsername());

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            User user = userRepo.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

            String roleName = (user.getRole() != null && user.getRole().getName() != null)
                              ? user.getRole().getName()
                              : "ROLE_NOT_ASSIGNED";

            return ResponseEntity.ok(new LoginResponse("Login Successful", jwt, roleName));
        } catch (Exception ex) {
            ex.printStackTrace(); // ✅ Print stack trace to see exact reason
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
