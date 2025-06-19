package com.medicalrecordsservice.mrs.service;

import com.medicalrecordsservice.mrs.model.MedicalRecord;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MedicalRecordService {
    MedicalRecord addRecord(MedicalRecord record);
    Optional<MedicalRecord> getRecord(Long id);
    List<MedicalRecord> getAllRecords();
    List<MedicalRecord> getRecordsByPatientId(Long patientId);
    MedicalRecord updateRecord(Long id, MedicalRecord record);
    void deleteRecord(Long id);
    
    // New methods

    List<MedicalRecord> getRecordsByDoctorId(Long doctorId);

    List<MedicalRecord> getRecordsByDateRange(LocalDate start, LocalDate end);

    List<MedicalRecord> searchRecords(String diagnosis, Long patientId);

    MedicalRecord partialUpdate(Long id, MedicalRecord partialRecord);

    List<MedicalRecord> bulkSave(List<MedicalRecord> records);
}
