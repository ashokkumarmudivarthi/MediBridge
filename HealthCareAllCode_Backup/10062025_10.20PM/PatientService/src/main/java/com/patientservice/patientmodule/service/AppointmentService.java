package com.patientservice.patientmodule.service;



import com.patientservice.patientmodule.model.Appointment;
import com.patientservice.patientmodule.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Schedule a new appointment.
     * If the status is not provided, default it to "Scheduled".
     */
    public Appointment scheduleAppointment(Appointment appointment) {
        if (appointment.getStatus() == null || appointment.getStatus().trim().isEmpty()) {
            appointment.setStatus("Scheduled");
        }
        return appointmentRepository.save(appointment);
    }

    /**
     * Retrieve an appointment by its id.
     * Throws a RuntimeException if not found.
     */
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    /**
     * Update an existing appointment.
     * Throws a RuntimeException if the appointment is not found.
     */
    public Appointment updateAppointment(Long id, Appointment appointmentUpdate) {
        Appointment existingAppointment = getAppointmentById(id);
        
        // Update allowed fields - adjust as needed for your rules
        existingAppointment.setPatientId(appointmentUpdate.getPatientId());
        existingAppointment.setDoctorId(appointmentUpdate.getDoctorId());
        existingAppointment.setAppointmentDate(appointmentUpdate.getAppointmentDate());
        existingAppointment.setReason(appointmentUpdate.getReason());
        existingAppointment.setStatus(appointmentUpdate.getStatus());
        
        return appointmentRepository.save(existingAppointment);
    }

    /**
     * Cancel an appointment by setting its status to "Cancelled".
     */
    public Appointment cancelAppointment(Long id) {
        Appointment existingAppointment = getAppointmentById(id);
        existingAppointment.setStatus("Cancelled");
        return appointmentRepository.save(existingAppointment);
    }

    /**
     * Retrieve all appointments.
     */
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    /**
     * Filter appointments based on provided criteria.
     */
    public List<Appointment> filterAppointments(String status, String reason, String patientId) {
        return appointmentRepository.findAll().stream()
                .filter(appt -> status == null || appt.getStatus().equalsIgnoreCase(status))
                .filter(appt -> reason == null || appt.getReason().equalsIgnoreCase(reason))
                .filter(appt -> patientId == null || appt.getPatientId().equalsIgnoreCase(patientId))
                .collect(Collectors.toList());
    }

    /**
     * Retrieve appointments for a specific patient.
     */
    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
}

