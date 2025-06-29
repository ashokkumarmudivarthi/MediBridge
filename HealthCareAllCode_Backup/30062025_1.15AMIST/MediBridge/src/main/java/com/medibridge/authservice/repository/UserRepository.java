package com.medibridge.authservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.authservice.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
   Optional<User> findByEmail(String email);
  //  Optional<User> existingUser = userRepository.findByEmail(email);
}
