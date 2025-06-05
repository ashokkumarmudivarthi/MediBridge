package com.medibridge.authservice.util;



import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashCheck {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Hashed password from your database
        String hash = "$2a$10$Kj2wZru6zU4nxgBkYByO1O2xS3ODg08akUvF2kLrjmzS17hTVO8AC";
        
        // Try checking with different plain text passwords
        System.out.println("Match password123? " + encoder.matches("password123", hash)); // Should be true
        System.out.println("Match test123? " + encoder.matches("test123", hash));         // Should be false
    }
}
