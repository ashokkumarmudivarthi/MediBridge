package com.appointmentservice.appointmentmodule.repository;

import com.appointmentservice.appointmentmodule.model.PublicAppointmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicAppointmentRequestRepository extends JpaRepository<PublicAppointmentRequest, Long> {
}
