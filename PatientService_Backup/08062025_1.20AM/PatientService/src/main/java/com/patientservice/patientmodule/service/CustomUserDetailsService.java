package com.patientservice.patientmodule.service;

//package com.patientservice.patientmodule.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // In patientservice, you don't load user from DB but validate JWT token instead.
        // But Spring Security requires this bean, so return a dummy user with username and role.
        return new User(username, "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_PATIENT")));
    }
}
