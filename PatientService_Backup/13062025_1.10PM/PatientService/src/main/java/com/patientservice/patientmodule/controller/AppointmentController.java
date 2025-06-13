package com.patientservice.patientmodule.controller;



import com.patientservice.patientmodule.model.Appointment;
import com.patientservice.patientmodule.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Schedule a new appointment
    @PostMapping("/schedule")
    public ResponseEntity<Map<String, Object>> scheduleAppointment(@RequestBody Appointment appointment) {
        Appointment savedAppointment = appointmentService.scheduleAppointment(appointment);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Appointment successfully scheduled");
        response.put("appointment", savedAppointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Retrieve appointments with optional filtering
    @GetMapping("/list")
    public ResponseEntity<List<Appointment>> getAppointments(@RequestParam(required = false) String status,
                                                               @RequestParam(required = false) String reason,
                                                               @RequestParam(required = false) String patientId) {
        List<Appointment> appointments = appointmentService.filterAppointments(status, reason, patientId);
        return ResponseEntity.ok(appointments);
    }

    // Get appointment details by id
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentDetails(@PathVariable("id") Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    // Update an appointment
    @PutMapping("/{id}/update")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable("id") Long id,
                                                         @RequestBody Appointment appointmentUpdate) {
        Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentUpdate);
        return ResponseEntity.ok(updatedAppointment);
    }

    // Cancel an appointment (sets status to "Cancelled")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelAppointment(@PathVariable("id") Long id) {
        Appointment cancelledAppointment = appointmentService.cancelAppointment(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Appointment successfully cancelled");
        return ResponseEntity.ok(response);
    }

    // Retrieve appointments for a specific patient by patientId
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<Appointment>> listAppointmentsForPatient(@PathVariable("patientId") String patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        if (appointments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(appointments);
    }
}
