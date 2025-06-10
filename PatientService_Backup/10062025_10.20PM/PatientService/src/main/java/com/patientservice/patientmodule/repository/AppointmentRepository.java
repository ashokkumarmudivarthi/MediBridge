package com.patientservice.patientmodule.repository;

//package com.wellnesswave.healthcare.repository;

import com.patientservice.patientmodule.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(String patientId);
}
