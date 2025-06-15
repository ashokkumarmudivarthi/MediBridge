package com.medibridge.authservice.controller;

import com.medibridge.authservice.model.User;
import com.medibridge.authservice.repository.UserRepository;
import com.medibridge.authservice.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ProfileController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // Get profile data from current logged-in user via Authentication or JWT token
    @GetMapping
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName(); // usually username

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("role", user.getRole() != null ? user.getRole().getName() : "ROLE_NOT_ASSIGNED");
        profile.put("fullName", user.getFullName());
        profile.put("email", user.getEmail());

        return ResponseEntity.ok(profile);
    }

    // Edit profile endpoint - example updates fullName and email only
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();

        if (updates.containsKey("fullName")) {
            user.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            user.setEmail(updates.get("email"));
        }

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }
}
