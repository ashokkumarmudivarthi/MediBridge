/*package com.medicalrecordsservice.mrs.service.impl;

import com.medicalrecordsservice.mrs.model.MedicalRecord;
import com.medicalrecordsservice.mrs.repository.MedicalRecordRepository;
import com.medicalrecordsservice.mrs.service.MedicalRecordService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;

    @Override
    public MedicalRecord addRecord(MedicalRecord record) {
        return repository.save(record);
    }

    @Override
    public Optional<MedicalRecord> getRecord(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<MedicalRecord> getAllRecords() {
        return repository.findAll();
    }

    @Override
    public List<MedicalRecord> getRecordsByPatientId(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    @Override
    public MedicalRecord updateRecord(Long id, MedicalRecord record) {
        record.setId(id);
        return repository.save(record);
    }

    @Override
    public void deleteRecord(Long id) {
        repository.deleteById(id);
    }
    
 // New methods for advanced APIs

    @Override
    public List<MedicalRecord> getRecordsByDoctorId(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    @Override
    public List<MedicalRecord> getRecordsByDateRange(LocalDate start, LocalDate end) {
        return repository.findByRecordDateBetween(start, end);
    }

    @Override
    public List<MedicalRecord> searchRecords(String diagnosis, Long patientId) {
        return repository.search(diagnosis, patientId);
    }

    @Override
    @Transactional
    public MedicalRecord partialUpdate(Long id, MedicalRecord partialRecord) {
        Optional<MedicalRecord> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("MedicalRecord not found with id " + id);
        }
        MedicalRecord existing = optional.get();

        if (partialRecord.getDiagnosis() != null) {
            existing.setDiagnosis(partialRecord.getDiagnosis());
        }
        if (partialRecord.getPrescription() != null) {
            existing.setPrescription(partialRecord.getPrescription());
        }
        if (partialRecord.getNotes() != null) {
            existing.setNotes(partialRecord.getNotes());
        }
        // Update more fields if needed...

        return repository.save(existing);
    }

    @Override
    @Transactional
    public List<MedicalRecord> bulkSave(List<MedicalRecord> records) {
        return repository.saveAll(records);
    }
    
    
    
    
    
    
}*/

package com.medicalrecordsservice.mrs.service.impl;

import com.medicalrecordsservice.mrs.model.MedicalRecord;
import com.medicalrecordsservice.mrs.model.Doctor;
import com.medicalrecordsservice.mrs.repository.MedicalRecordRepository;
import com.medicalrecordsservice.mrs.repository.DoctorRepository;
import com.medicalrecordsservice.mrs.service.MedicalRecordService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final DoctorRepository doctorRepository;

    @Override
    public MedicalRecord addRecord(MedicalRecord record) {
        return repository.save(record);
    }

    @Override
    public Optional<MedicalRecord> getRecord(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<MedicalRecord> getAllRecords() {
        return repository.findAll();
    }

    @Override
    public List<MedicalRecord> getRecordsByPatientId(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    @Override
    public MedicalRecord updateRecord(Long id, MedicalRecord record) {
        record.setId(id);
        return repository.save(record);
    }

    @Override
    public void deleteRecord(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<MedicalRecord> getRecordsByDoctorId(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    @Override
    public List<MedicalRecord> getRecordsByDateRange(LocalDate start, LocalDate end) {
        return repository.findByRecordDateBetween(start, end);
    }

    @Override
    public List<MedicalRecord> searchRecords(String diagnosis, Long patientId) {
        return repository.search(diagnosis, patientId);
    }

    @Override
    @Transactional
    public MedicalRecord partialUpdate(Long id, MedicalRecord partialRecord) {
        Optional<MedicalRecord> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("MedicalRecord not found with id " + id);
        }
        MedicalRecord existing = optional.get();

        if (partialRecord.getDiagnosis() != null) {
            existing.setDiagnosis(partialRecord.getDiagnosis());
        }
        if (partialRecord.getPrescription() != null) {
            existing.setPrescription(partialRecord.getPrescription());
        }
        if (partialRecord.getNotes() != null) {
            existing.setNotes(partialRecord.getNotes());
        }

        return repository.save(existing);
    }

    @Override
    @Transactional
    public List<MedicalRecord> bulkSave(List<MedicalRecord> records) {
        return repository.saveAll(records);
    }

    @Override
    public MedicalRecord saveMedicalRecord(MedicalRecord record) {
        Doctor doctor = doctorRepository.findById(record.getDoctorId()).orElse(null);
        if (doctor != null) {
            record.setDoctorName(doctor.getDoctorName());
        }
        return repository.save(record);
    }
}

