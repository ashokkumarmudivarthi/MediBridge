package com.medibridge.authservice.util;



import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordCheckTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "password123";
        String hashedPasswordFromDb = "$2a$10$Kj2wZru6zU4nxgBkYByO1O2xS3ODg08akUvF2kLrjmzS17hTVO8AC";

        System.out.println("Matches? " + encoder.matches(rawPassword, hashedPasswordFromDb));
    }
}
