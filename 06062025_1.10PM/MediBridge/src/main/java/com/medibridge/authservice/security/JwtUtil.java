package com.medibridge.authservice.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

  /*  private Key getSigningKey() {
    	
    	byte[] keyBytes = Decoders.BASE64.decode(secret);
       // return Keys.hmacShaKeyFor(keyBytes);
        return Keys.hmacShaKeyFor(secret.getBytes());
    }*/
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate JWT token for manual login (UserDetails).
     */
    public String generateToken(UserDetails userDetails) {
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return buildToken(userDetails.getUsername(), roles);
    }

    /**
     * Generate JWT token for SSO login (email or username string).
     * This method does not include roles unless you fetch and provide them explicitly.
     */
    public String generateToken(String username) {
        return buildToken(username, null);
    }

    /**
     * Shared logic to build the token with optional roles.
     */
    private String buildToken(String subject, List<String> roles) {
        var builder = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512);

        if (roles != null) {
            builder.claim("roles", roles);
        }

        return builder.compact();
    }
    
    
}
