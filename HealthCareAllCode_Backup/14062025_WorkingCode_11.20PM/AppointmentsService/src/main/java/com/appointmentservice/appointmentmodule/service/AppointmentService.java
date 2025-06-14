/*package com.appointmentservice.appointmentmodule.service;



import com.appointmentservice.appointmentmodule.model.Appointment;
import com.appointmentservice.appointmentmodule.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    
    public Appointment scheduleAppointment(Appointment appointment) {
        if (appointment.getStatus() == null || appointment.getStatus().trim().isEmpty()) {
            appointment.setStatus("Scheduled");
        }
        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

  
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

  
    public Appointment cancelAppointment(Long id) {
        Appointment existingAppointment = getAppointmentById(id);
        existingAppointment.setStatus("Cancelled");
        return appointmentRepository.save(existingAppointment);
    }

  
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    
    public List<Appointment> filterAppointments(String status, String reason, String patientId) {
        return appointmentRepository.findAll().stream()
                .filter(appt -> status == null || appt.getStatus().equalsIgnoreCase(status))
                .filter(appt -> reason == null || appt.getReason().equalsIgnoreCase(reason))
                .filter(appt -> patientId == null || appt.getPatientId().equalsIgnoreCase(patientId))
                .collect(Collectors.toList());
    }

   
    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
}
*/


package com.appointmentservice.appointmentmodule.service;

import com.appointmentservice.appointmentmodule.model.Appointment;
import com.appointmentservice.appointmentmodule.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor // ✅ Lombok generates constructor for final fields
public class AppointmentService {

    private final AppointmentRepository repository; // ✅ Spring injects via constructor

    public Appointment scheduleAppointment(Appointment appointment) {
        appointment.setStatus("Scheduled");
        return repository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment updated) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Appointment not found"));
        appointment.setAppointmentDate(updated.getAppointmentDate());
        appointment.setDoctorName(updated.getDoctorName());
        appointment.setReason(updated.getReason());
        return repository.save(appointment);
    }

    public List<Appointment> listAppointmentsForPatient(String patientId) {
        return repository.findByPatientId(patientId);
    }

    public void cancelAppointment(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Appointment not found"));
        repository.delete(appointment);
    }

    public List<Appointment> listAllAppointments() {
        return repository.findAll();
    }
}

