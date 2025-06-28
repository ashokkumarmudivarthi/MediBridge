package com.medibridge.authservice.service;

import com.medibridge.authservice.model.User;
import com.medibridge.authservice.model.Role;
import com.medibridge.authservice.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository repo) {
        this.userRepository = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        System.out.println("Loaded password hash from DB: " + user.getPassword());

        Collection<GrantedAuthority> authorities;

        if (user.getRole() != null) {
            authorities = java.util.Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().getName())
            );
        } else {
            authorities = java.util.Collections.emptyList();
        }

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities
        );
    }
    
    
    
}


/*package com.medibridge.authservice.service;

import com.medibridge.authservice.model.User;
import com.medibridge.authservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository repo) {
        this.userRepository = repo;
    }

    // For manual login (by username)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return mapToUserDetails(user);
    }

    // For OAuth login (by email)
    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return mapToUserDetails(user);
    }

    // Common mapping logic
    private UserDetails mapToUserDetails(User user) {
        Collection<GrantedAuthority> authorities = user.getRole() != null
            ? java.util.Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getName()))
            : java.util.Collections.emptyList();

        // Here, use email as username in security context if needed
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(), // <== using email as principal
            user.getPassword() != null ? user.getPassword() : "", // dummy for OAuth2
            authorities
        );
    }
}*/
