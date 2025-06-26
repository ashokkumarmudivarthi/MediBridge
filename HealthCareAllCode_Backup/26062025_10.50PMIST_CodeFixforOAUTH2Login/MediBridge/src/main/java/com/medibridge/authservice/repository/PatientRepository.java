package com.medibridge.authservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.authservice.model.Patient;
import com.medibridge.authservice.model.User;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByUser(User user);

}
