/*package com.patientservice.patientmodule.service;

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
*/


package com.patientservice.patientmodule.service;

import com.patientservice.patientmodule.model.Users;
import com.patientservice.patientmodule.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Ensure "ROLE_" prefix is added
        String role = "ROLE_" + user.getRoleId();

    /*    return new User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );*/
        
        String roleName;

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

        return new User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );

    }
    
    
}
