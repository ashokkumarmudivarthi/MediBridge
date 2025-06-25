/*package com.doctorservice.dm.service;

import com.doctorservice.dm.model.Users;
import com.doctorservice.dm.repository.UserRepository;

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
        System.out.println("CustomUserDetailsService: loadUserByUsername called for: " + username);

        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("CustomUserDetailsService: User not found: " + username);
                    return new UsernameNotFoundException("User not found: " + username);
                });

        System.out.println("CustomUserDetailsService: User found with roleId = " + user.getRoleId());

        final String roleName;
        switch (user.getRoleId().intValue()) {
            case 1:
                roleName = "ROLE_ADMIN";
                break;
            case 2:
                roleName = "ROLE_DOCTOR";
                break;
            case 3:
                roleName = "ROLE_PATIENT";
                break;
            default:
                roleName = "ROLE_USER";
                break;
        }

        System.out.println("CustomUserDetailsService: Returning UserDetails with role: " + roleName);

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );
    }
}*/


package com.doctorservice.dm.service;

import com.doctorservice.dm.model.Users;
import com.doctorservice.dm.repository.UserRepository;

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

