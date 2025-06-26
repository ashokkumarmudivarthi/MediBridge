package com.patientservice.patientmodule.controller;

import com.patientservice.patientmodule.entity.PatientVisitType;
import com.patientservice.patientmodule.service.VisitTypeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/patient-visits")
@CrossOrigin(origins = "*")
public class VisitTypeController {

    @Autowired
    private VisitTypeService visitTypeService;

    // Create a visit record (e.g., in-patient or out-patient)
    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<PatientVisitType> createVisit(@RequestBody PatientVisitType visit) {
        return ResponseEntity.ok(visitTypeService.createVisit(visit));
    }

    // View all visits by patientId
    @GetMapping("/patient/{patientId}")
   // @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DOCTOR')")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<PatientVisitType>> getVisitsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(visitTypeService.getVisitsByPatientId(patientId));
    }

    // (Optional) Logged-in patient view their own visit history
    @GetMapping("/my-visits")
   // @PreAuthorize("hasRole('ROLE_PATIENT')")
    @PreAuthorize("hasRole('PATIENT')")

    public ResponseEntity<List<PatientVisitType>> getMyVisits(Principal principal) {
        String username = principal.getName();
        List<PatientVisitType> visits = visitTypeService.getVisitsByUsername(username);
        return ResponseEntity.ok(visits);
    }

    // (Optional) Update visit status (e.g., discharged)
    @PutMapping("/{visitId}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<PatientVisitType> updateVisitStatus(
            @PathVariable Long visitId,
            @RequestParam String status) {
        PatientVisitType updated = visitTypeService.updateVisitStatus(visitId, status);
        return ResponseEntity.ok(updated);
    }
}
