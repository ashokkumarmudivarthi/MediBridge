package com.patientservice.patientmodule.controller;

import com.patientservice.patientmodule.entity.Hospital;
import com.patientservice.patientmodule.model.Patient;
import com.patientservice.patientmodule.repository.HospitalRepository;
import com.patientservice.patientmodule.response.PatientResponse;
import com.patientservice.patientmodule.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private HospitalRepository hospitalRepository;

    // Show registration form (returns HTML page)
    @GetMapping("/register")
    public String showPatientRegistrationForm(
            @RequestHeader(value = "User-Agent", required = false) String userAgent // example header usage
    ) {
        System.out.println("User-Agent header: " + userAgent);
        return "PatientRegistration";
    }

  /*  // Register patient (form submission) with header reading example
    @PostMapping(value = "/register", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<PatientResponse> registerPatient(
            Patient patient,
            @RequestHeader(value = "X-Request-ID", required = false) String requestId  // custom header example
    ) {
        System.out.println("X-Request-ID header: " + requestId);

        Patient savedPatient = patientService.registerPatient(patient);
        PatientResponse response = new PatientResponse("Patient details are registered successfully", savedPatient);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }*/

    // Get all patients with Authorization header example
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        System.out.println("Authorization header: " + authorizationHeader);
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    // Get patient by ID with optional custom header
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id,
            @RequestHeader(value = "X-Custom-Header", required = false) String customHeader
    ) {
        System.out.println("X-Custom-Header: " + customHeader);
        Optional<Patient> patientOpt = patientService.getPatientById(id);
        return patientOpt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Delete patient by ID, only accessible to ROLE_ADMIN, header reading example
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deletePatient(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = true) String authHeader
    ) {
        System.out.println("Authorization header for delete: " + authHeader);
        String responseMessage = patientService.deletePatient(id);
        if (responseMessage.contains("deleted successfully")) {
            return new ResponseEntity<>(responseMessage, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(responseMessage, HttpStatus.NOT_FOUND);
        }
    }

    // Get list of hospitals by city with headers example
    @GetMapping("/hospitals")
    public ResponseEntity<List<Hospital>> getHospitalsByCity(
            @RequestParam("city") String city,
            @RequestHeader(value = "X-Request-ID", required = false) String requestId
    ) {
        System.out.println("X-Request-ID for hospitals: " + requestId);
        return ResponseEntity.ok(hospitalRepository.findByCity(city));
    }

    // Add mock hospitals (for testing/demo) with header logging
    @PostMapping("/mock-hospitals")
    public ResponseEntity<String> addMockHospitals(
            @RequestHeader(value = "X-Admin-Token", required = false) String adminToken
    ) {
        System.out.println("X-Admin-Token: " + adminToken);

        hospitalRepository.deleteAll();

        List<Hospital> hospitals = List.of(
                new Hospital(null, "Dallas Medical Center", "Dallas"),
                new Hospital(null, "Parkland Hospital", "Dallas"),
                new Hospital(null, "UT Southwestern", "Dallas"),
                new Hospital(null, "Austin General Hospital", "Austin")
        );
        hospitalRepository.saveAll(hospitals);

        return ResponseEntity.ok("Mock hospitals added successfully!");
    }

    // Show filtered patient list (HTML view) with optional header
    @GetMapping("/list")
    public String showPatientList(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String disease,
            @RequestParam(required = false) String hospital,
            Model model,
            @RequestHeader(value = "User-Agent", required = false) String userAgent
    ) {
        System.out.println("User-Agent in list: " + userAgent);

        List<Patient> patients = patientService.filterPatients(city, disease, hospital);

        model.addAttribute("patients", patients);
        model.addAttribute("city", city);
        model.addAttribute("disease", disease);
        model.addAttribute("hospital", hospital);

        return "patient-list";
    }

    // Get filtered patient list as JSON with header example
    @GetMapping("/list-json")
    @ResponseBody
    public List<Patient> getPatientsJson(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String disease,
            @RequestParam(required = false) String hospital,
            @RequestHeader(value = "X-Trace-Id", required = false) String traceId
    ) {
        System.out.println("X-Trace-Id: " + traceId);
        return patientService.filterPatients(city, disease, hospital);
    }

    // Global exception handler for this controller
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<PatientResponse> registerPatient(
            @RequestBody Patient patient,
            @RequestHeader(value = "X-Request-ID", required = false) String requestId
    ) {
        System.out.println("X-Request-ID header: " + requestId);

        Patient savedPatient = patientService.registerPatient(patient);
        PatientResponse response = new PatientResponse("Patient details are registered successfully", savedPatient);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
  /*  
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        Patient updatedPatient = patientService.updatePatient(id, patient);
        return ResponseEntity.ok(updatedPatient);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Patient> patchPatient(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Patient updated = patientService.patchPatient(id, updates);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam(required = false) String disease,
                                        @RequestParam(required = false) String city) {
        return patientService.searchPatientsByCriteria(disease, city);
    }
    
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportPatients(@RequestParam String format) {
        byte[] file = patientService.export(format); // CSV or PDF
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=patients." + format);
        return ResponseEntity.ok().headers(headers).body(file);
    }
    
    @GetMapping("/stats")
    public Map<String, Long> getPatientStats() {
        return patientService.getPatientStatistics();
    }
    */
    

}
