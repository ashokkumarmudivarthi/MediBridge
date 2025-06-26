package com.medicalrecordsservice.mrs.service;

import com.medicalrecordsservice.mrs.model.Users;
import com.medicalrecordsservice.mrs.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        if (username == null || username.trim().isEmpty()) {
            throw new UsernameNotFoundException("Username must not be empty");
        }

        System.out.println("[CustomUserDetailsService] Looking up user: " + username);

        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("[CustomUserDetailsService] User not found: " + username);
                    return new UsernameNotFoundException("User not found: " + username);
                });

        String roleName = resolveRoleName(user.getRoleId());

        System.out.println("[CustomUserDetailsService] Authenticated user with role: " + roleName);

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );
    }

    private String resolveRoleName(Long roleId) {
        if (roleId == null) {
            return "ROLE_USER";
        }

        return switch (roleId.intValue()) {
            case 1 -> "ROLE_ADMIN";
            case 2 -> "ROLE_DOCTOR";
            case 3 -> "ROLE_PATIENT";
            default -> "ROLE_USER";
        };
    }
}

