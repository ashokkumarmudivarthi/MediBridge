/*package com.medicalrecordsservice.mrs.controller;


import com.medicalrecordsservice.mrs.util.ApiResponse;
import com.medicalrecordsservice.mrs.dto.MedicalRecordDTO;
import com.medicalrecordsservice.mrs.model.MedicalRecord;
import com.medicalrecordsservice.mrs.service.MedicalRecordService;



import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService service;
    
 //   @Autowired
 //   private PatientRepository patientRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecord>> create(@RequestBody MedicalRecord record) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Record added", service.addRecord(record)));
        
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> getOne(@PathVariable Long id) {
        return service.getRecord(id)
                .map(rec -> ResponseEntity.ok(new ApiResponse<>(true, "Record found", rec)))
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "All records fetched", service.getAllRecords()));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Records for patient", service.getRecordsByPatientId(patientId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> update(@PathVariable Long id, @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Record updated", service.updateRecord(id, record)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.deleteRecord(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Record deleted", null));
    }
    
    // a. GET by doctorId
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecord> records = service.getRecordsByDoctorId(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", records));
    }

    // b. GET date-range
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<MedicalRecord> records = service.getRecordsByDateRange(start, end);
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", records));
    }

    // c. GET flexible search
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> search(
            @RequestParam(required = false) String diagnosis,
            @RequestParam(required = false) Long patientId) {
        List<MedicalRecord> records = service.searchRecords(diagnosis, patientId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", records));
    }

    // d. PATCH partial update
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> partialUpdate(
            @PathVariable Long id,
            @RequestBody MedicalRecord partialRecord) {
        MedicalRecord updated = service.partialUpdate(id, partialRecord);
        return ResponseEntity.ok(new ApiResponse<>(true, "Record updated successfully", updated));
    }

    // e. POST bulk save
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> bulkSave(@RequestBody List<MedicalRecord> records) {
        List<MedicalRecord> savedRecords = service.bulkSave(records);
        return ResponseEntity.ok(new ApiResponse<>(true, savedRecords.size() + " records saved successfully", savedRecords));
    }
    
   
    
    @GetMapping("/patient/{patientId}/export")
    public ResponseEntity<byte[]> exportMedicalRecords(@PathVariable Long patientId) throws IOException {
        List<MedicalRecord> records = service.getRecordsByPatientId(patientId);

        StringBuilder csv = new StringBuilder();
        csv.append("Diagnosis,Date,Doctor Name\n");
        for (MedicalRecord rec : records) {
            csv.append(String.format("%s,%s,%s\n",
                rec.getDiagnosis(),
                rec.getRecordDate(),
                rec.getDoctorName()));
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=medical_records.csv");
        headers.add(HttpHeaders.CONTENT_TYPE, "text/csv");
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(bytes);
    }
    
   

    
    @GetMapping("/doctor/{doctorId}/assigned-patients-records")
    public ResponseEntity<ApiResponse<List<MedicalRecordDTO>>> getRecordsForDoctorPatients(@PathVariable Long doctorId) {
        List<MedicalRecordDTO> records = service.getRecordsForPatientsOfDoctor(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient records fetched successfully", records));
    }

    
}
*/

package com.medicalrecordsservice.mrs.controller;

import com.medicalrecordsservice.mrs.dto.MedicalRecordDTO;
import com.medicalrecordsservice.mrs.model.MedicalRecord;
import com.medicalrecordsservice.mrs.service.MedicalRecordService;
import com.medicalrecordsservice.mrs.util.ApiResponse;

import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService service;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecord>> create(@RequestBody MedicalRecord record) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Record added", service.addRecord(record)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> getOne(@PathVariable Long id) {
        return service.getRecord(id)
                .map(rec -> ResponseEntity.ok(new ApiResponse<>(true, "Record found", rec)))
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "All records fetched", service.getAllRecords()));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Records for patient", service.getRecordsByPatientId(patientId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> update(@PathVariable Long id, @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Record updated", service.updateRecord(id, record)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.deleteRecord(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Record deleted", null));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecord> records = service.getRecordsByDoctorId(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", records));
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<MedicalRecord> records = service.getRecordsByDateRange(start, end);
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", records));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> search(
            @RequestParam(required = false) String diagnosis,
            @RequestParam(required = false) Long patientId) {
        List<MedicalRecord> records = service.searchRecords(diagnosis, patientId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", records));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> partialUpdate(
            @PathVariable Long id,
            @RequestBody MedicalRecord partialRecord) {
        MedicalRecord updated = service.partialUpdate(id, partialRecord);
        return ResponseEntity.ok(new ApiResponse<>(true, "Record updated successfully", updated));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> bulkSave(@RequestBody List<MedicalRecord> records) {
        List<MedicalRecord> savedRecords = service.bulkSave(records);
        return ResponseEntity.ok(new ApiResponse<>(true, savedRecords.size() + " records saved successfully", savedRecords));
    }

    @GetMapping("/patient/{patientId}/export")
    public ResponseEntity<byte[]> exportMedicalRecords(@PathVariable Long patientId) throws IOException {
        List<MedicalRecord> records = service.getRecordsByPatientId(patientId);

        StringBuilder csv = new StringBuilder();
        csv.append("Diagnosis,Date,Doctor Name\n");
        for (MedicalRecord rec : records) {
            csv.append(String.format("%s,%s,%s\n",
                    rec.getDiagnosis(),
                    rec.getRecordDate(),
                    rec.getDoctorName()));
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=medical_records.csv");
        headers.add(HttpHeaders.CONTENT_TYPE, "text/csv");
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(bytes);
    }

    @GetMapping("/doctor/{doctorId}/assigned-patients-records")
    public ResponseEntity<ApiResponse<List<MedicalRecordDTO>>> getRecordsForDoctorPatients(@PathVariable Long doctorId) {
        List<MedicalRecordDTO> records = service.getRecordsForPatientsOfDoctor(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient records fetched successfully", records));
    }

}

