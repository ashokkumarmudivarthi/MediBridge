/*package com.appointmentservice.appointmentmodule.controller;

import com.appointmentservice.appointmentmodule.model.Appointment;
import com.appointmentservice.appointmentmodule.service.AppointmentService;
import com.appointmentservice.appointmentmodule.util.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor // ✅ Lombok will inject the constructor with the final field
public class AppointmentController {

    private final AppointmentService service; // ✅ No need to manually instantiate

    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    @PostMapping("/schedule")
    public ResponseEntity<ApiResponse<Appointment>> schedule(@RequestBody Appointment appointment) {
        Appointment saved = service.scheduleAppointment(appointment);
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointment updated", saved));
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'PATIENT')")
    @GetMapping("/list")
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(service.listAllAppointments());
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(service.listAppointmentsForPatient(patientId));
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @PutMapping("/{id}/update")
    public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(service.updateAppointment(id, appointment));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancel(@PathVariable Long id) {
        service.cancelAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled"));
    }
    
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor")
    public ResponseEntity<List<Appointment>> getAppointmentsForDoctor(@RequestParam String doctorId) {
        return ResponseEntity.ok(service.listAppointmentsForDoctor(doctorId));
    }

    
    
    
}
*/


package com.appointmentservice.appointmentmodule.controller;

import com.appointmentservice.appointmentmodule.model.Appointment;
import com.appointmentservice.appointmentmodule.service.AppointmentService;
import com.appointmentservice.appointmentmodule.util.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor // ✅ Lombok will inject the constructor with the final field
public class AppointmentController {

    private final AppointmentService service; // ✅ No need to manually instantiate

    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    @PostMapping("/schedule")
    public ResponseEntity<ApiResponse<Appointment>> schedule(@RequestBody Appointment appointment) {
        Appointment saved = service.scheduleAppointment(appointment);
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointment updated", saved));
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'PATIENT')")
    @GetMapping("/list")
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(service.listAllAppointments());
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(service.listAppointmentsForPatient(patientId));
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @PutMapping("/{id}/update")
    public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(service.updateAppointment(id, appointment));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancel(@PathVariable Long id) {
        service.cancelAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled"));
    }
    
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor")
    public ResponseEntity<List<Appointment>> getAppointmentsForDoctor(@RequestParam String doctorId) {
        return ResponseEntity.ok(service.listAppointmentsForDoctor(doctorId));
    }

    
    
    
}
