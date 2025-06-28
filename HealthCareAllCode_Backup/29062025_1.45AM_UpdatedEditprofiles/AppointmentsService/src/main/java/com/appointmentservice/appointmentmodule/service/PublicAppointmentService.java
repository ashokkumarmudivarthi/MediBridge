package com.appointmentservice.appointmentmodule.service;

import com.appointmentservice.appointmentmodule.model.PublicAppointmentRequest;
import com.appointmentservice.appointmentmodule.repository.PublicAppointmentRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicAppointmentService {

    private final PublicAppointmentRequestRepository repository;

    public PublicAppointmentRequest submitRequest(PublicAppointmentRequest request) {
        request.setStatus("Pending"); // default
        return repository.save(request);
    }
}
