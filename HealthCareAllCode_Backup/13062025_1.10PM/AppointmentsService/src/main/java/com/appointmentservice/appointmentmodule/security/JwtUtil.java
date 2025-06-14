package com.appointmentservice.appointmentmodule.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key getSigningKey() {
        if (secret == null || secret.isEmpty()) {
            System.out.println(">>> JWT Secret is NULL or EMPTY. Please check application.properties");
        } else {
            System.out.println(">>> JWT Secret is LOADED");
        }
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    private Claims extractAllClaims(String token) {
        try {
            System.out.println(">>> Parsing JWT token...");
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println(">>> JWT parsing error: " + e.getMessage());
            throw e;
        }
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            System.out.println(">>> JWT Token is VALID");
            return true;
        } catch (Exception e) {
            System.out.println(">>> JWT Token is INVALID");
            return false;
        }
    }
}
