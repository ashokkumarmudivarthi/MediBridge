/*
package com.doctorservice.dm.controller;

import com.doctorservice.dm.model.Doctor;
import com.doctorservice.dm.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // For dev; restrict in production
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    // Register a new doctor
    @PostMapping("/register")
    public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor) {
        try {
            Doctor savedDoctor = doctorService.registerDoctor(doctor);
            return ResponseEntity.ok("Doctor registered successfully with ID: " + savedDoctor.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to register doctor: " + e.getMessage());
        }
    }

    // Get doctor by ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    // Update doctor info by ID
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
            return ResponseEntity.ok("Doctor information updated successfully for ID: " + updatedDoctor.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error updating doctor: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    // Delete doctor by ID
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctorById(id);
            return ResponseEntity.ok("Doctor deleted successfully with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error deleting doctor: " + e.getMessage());
        }
    }

    // Get all doctors
    @GetMapping("/list")
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // Filter doctors by ID or specialization
    @GetMapping("/filter")
    public List<Doctor> getDoctorList(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String specialization) {
        return doctorService.findDoctors(doctorId, specialization);
    }
}*/

package com.doctorservice.dm.controller;

import com.doctorservice.dm.model.Doctor;
import com.doctorservice.dm.service.DoctorService;
import com.doctorservice.dm.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Doctor>> registerDoctor(@RequestBody Doctor doctor) {
        try {
            Doctor savedDoctor = doctorService.registerDoctor(doctor);
            return ResponseEntity.ok(new ApiResponse<>(true, "Doctor registered successfully", savedDoctor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Failed to register doctor: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(doctor -> ResponseEntity.ok(new ApiResponse<>(true, "Doctor found", doctor)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Doctor not found with ID: " + id, null)));
    }

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse<Doctor>> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
            return ResponseEntity.ok(new ApiResponse<>(true, "Doctor updated successfully", updatedDoctor));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Error updating doctor: " + e.getMessage(), null));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctorById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Doctor deleted successfully with ID: " + id, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Error deleting doctor: " + e.getMessage(), null));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(new ApiResponse<>(true, "List of all doctors", doctors));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<Doctor>>> getDoctorList(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String specialization) {
        List<Doctor> filteredDoctors = doctorService.findDoctors(doctorId, specialization);
        return ResponseEntity.ok(new ApiResponse<>(true, "Filtered doctor list", filteredDoctors));
    }
}



