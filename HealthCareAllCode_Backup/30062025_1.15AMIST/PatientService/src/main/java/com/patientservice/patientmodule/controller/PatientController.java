//Working code improvinf with more endpoints
package com.patientservice.patientmodule.controller;

import com.patientservice.patientmodule.dto.PatientUpdateRequest;
import com.patientservice.patientmodule.entity.Hospital;
import com.patientservice.patientmodule.model.Patient;
import com.patientservice.patientmodule.repository.HospitalRepository;
import com.patientservice.patientmodule.repository.PatientRepository;
import com.patientservice.patientmodule.response.PatientResponse;
import com.patientservice.patientmodule.service.PatientService;
import com.patientservice.patientmodule.util.ApiResponse;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;



@RestController
@CrossOrigin(origins = "*") // For dev; restrict origin in prod
@RequiredArgsConstructor 
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private HospitalRepository hospitalRepository;
    
    
    @Autowired
    private PatientRepository patientRepository;

    
    
   // private final PatientRepository patientRepository;

    // Show registration form (returns HTML page)
    @GetMapping("/register")
    public String showPatientRegistrationForm(
            @RequestHeader(value = "User-Agent", required = false) String userAgent // example header usage
    ) {
        System.out.println("User-Agent header: " + userAgent);
        return "PatientRegistration";
    }

  

    // Get all patients with Authorization header example
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        System.out.println("Authorization header: " + authorizationHeader);
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    
    @GetMapping("/id/{id}")
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

  
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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
    
 // NEW: Update patient endpoint using PatientUpdateRequest DTO
    @PutMapping("/{id}/update")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientUpdateRequest updateRequest,
            @RequestHeader(value = "X-Request-ID", required = false) String requestId
    ) {
        System.out.println("X-Request-ID for update: " + requestId);
        Patient updatedPatient = patientService.updatePatient(id, updateRequest);
        PatientResponse response = new PatientResponse("Patient updated successfully", updatedPatient);
        return ResponseEntity.ok(response);
    }


    // Global exception handler for this controller
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
   // @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    
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
    
    //public endpoint
    // ✅ New Public Registration Endpoint — No Auth Required
    @PostMapping(value = "/public/register", consumes = "application/json")
    public ResponseEntity<PatientResponse> publicRegisterPatient(
            @RequestBody Patient patient
    ) {
        Patient savedPatient = patientService.registerPatient(patient);
        PatientResponse response = new PatientResponse("Patient registered successfully (public)", savedPatient);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getPatientsCount() {
        long count = patientService.getPatientsCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    //filters search
    @GetMapping("/search")
    public ResponseEntity<?> searchPatients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String contact,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if ((name == null || name.isBlank()) &&
            (contact == null || contact.isBlank()) &&
            startDate == null && endDate == null) {
            return ResponseEntity.badRequest().body("At least one search filter must be provided.");
        }

        List<Patient> results = patientService.searchPatients(name, contact, startDate, endDate);
        return ResponseEntity.ok(results);
    }
    
  
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Patient>> getByUserId(@PathVariable Long userId) {
        Patient patient = patientService.findByUserId(userId);
        patient.setUser(null); // avoid recursion if needed
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient fetched", patient));
    }

    
    @GetMapping("/my-profile")
    @PreAuthorize("hasRole('ROLE_PATIENT')")
    public ResponseEntity<Patient> getLoggedInPatientProfile(java.security.Principal principal) {
        String username = principal.getName(); // Extract logged-in username
        Patient patient = patientService.findByUsername(username); // Fetch patient by username
        return ResponseEntity.ok(patient);
    }
    
    
    @GetMapping("/names")
    public ResponseEntity<Map<Long, String>> getPatientNames(@RequestParam("ids") List<Long> ids) {
        Map<Long, String> result = new HashMap<>();
        List<Patient> patients = patientRepository.findAllById(ids);

        for (Patient p : patients) {
            result.put(p.getId(), p.getName());
        }

        return ResponseEntity.ok(result);
    }




   
}
