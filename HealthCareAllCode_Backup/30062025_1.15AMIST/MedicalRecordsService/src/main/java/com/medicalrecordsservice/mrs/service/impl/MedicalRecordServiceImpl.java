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

/*package com.medicalrecordsservice.mrs.service.impl;

import com.medicalrecordsservice.mrs.model.MedicalRecord;
import com.medicalrecordsservice.mrs.model.Doctor;
import com.medicalrecordsservice.mrs.repository.MedicalRecordRepository;
import com.medicalrecordsservice.mrs.repository.DoctorRepository;
import com.medicalrecordsservice.mrs.service.MedicalRecordService;
import com.patientservice.patientmodule.repository.PatientRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

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
    
    @Override
    public List<MedicalRecord> getRecordsForPatientsOfDoctor(Long doctorId) {
        List<Long> patientIds = patientRepository.findPatientIdsByDoctorId(doctorId);
        return repository.findByPatientIdIn(patientIds); // FIXED
    }


    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
}
*/






/*
package com.medicalrecordsservice.mrs.service.impl;

import com.medicalrecordsservice.mrs.dto.MedicalRecordDTO;
import com.medicalrecordsservice.mrs.model.Doctor;
import com.medicalrecordsservice.mrs.model.MedicalRecord;
import com.medicalrecordsservice.mrs.repository.DoctorRepository;
import com.medicalrecordsservice.mrs.repository.MedicalRecordRepository;
import com.medicalrecordsservice.mrs.service.MedicalRecordService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final DoctorRepository doctorRepository;
    private final RestTemplate restTemplate;
  
    private final HttpServletRequest request;

    @Value("${patient.service.url}")
    private String patientServiceUrl;

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

    // ✅ Enriched doctor+patient-name method used in frontend
    @Override
    public List<MedicalRecordDTO> getRecordsForPatientsOfDoctor(Long doctorId) {
        List<MedicalRecord> records = repository.findByDoctorId(doctorId);

        List<Long> patientIds = records.stream()
                .map(MedicalRecord::getPatientId)
                .distinct()
                .toList();

        // Call PatientService for patient names (optional)
        String url = patientServiceUrl + "/api/patients/names?ids=" +
                patientIds.stream().map(String::valueOf).collect(Collectors.joining(","));

        Map<Long, String> patientNameMap;
        try {
            patientNameMap = restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            patientNameMap = Collections.emptyMap();
        }

        List<MedicalRecordDTO> result = new ArrayList<>();
        for (MedicalRecord record : records) {
            MedicalRecordDTO dto = new MedicalRecordDTO();
            dto.setId(record.getId());
            dto.setDoctorId(record.getDoctorId());
            dto.setDoctorName(record.getDoctorName()); // ✅ Use directly from DB
            dto.setPatientId(record.getPatientId());
            dto.setPatientName(patientNameMap.getOrDefault(record.getPatientId(), "Unknown Patient"));
            dto.setDiagnosis(record.getDiagnosis());
            dto.setTreatment(record.getTreatment());
            dto.setPrescription(record.getPrescription());
            dto.setRecordDate(record.getRecordDate());
            dto.setNotes(record.getNotes());
            result.add(dto);
        }

        return result;
    }

}
*/




package com.medicalrecordsservice.mrs.service.impl;

import com.medicalrecordsservice.mrs.dto.MedicalRecordDTO;
import com.medicalrecordsservice.mrs.model.Doctor;
import com.medicalrecordsservice.mrs.model.MedicalRecord;
import com.medicalrecordsservice.mrs.repository.DoctorRepository;
import com.medicalrecordsservice.mrs.repository.MedicalRecordRepository;
import com.medicalrecordsservice.mrs.service.MedicalRecordService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final DoctorRepository doctorRepository;
    private final RestTemplate restTemplate;
    private final HttpServletRequest request;

    @Value("${patient.service.url}")
    private String patientServiceUrl;

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
            record.setDoctorName(doctor.getDoctorName()); // Save doctor name into DB
        }
        return repository.save(record);
    }

    @Override
    public List<MedicalRecordDTO> getRecordsForPatientsOfDoctor(Long doctorId) {
        List<MedicalRecord> records = repository.findByDoctorId(doctorId);

        List<Long> patientIds = records.stream()
                .map(MedicalRecord::getPatientId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, String> patientNameMap = new HashMap<>();

        if (!patientIds.isEmpty()) {
            try {
                String url = patientServiceUrl + "/api/patients/names?ids=" +
                        patientIds.stream().map(String::valueOf).collect(Collectors.joining(","));

                HttpHeaders headers = new HttpHeaders();
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null) {
                    headers.set("Authorization", authHeader);
                }

                HttpEntity<String> entity = new HttpEntity<>(headers);

                ParameterizedTypeReference<Map<Long, String>> typeRef = new ParameterizedTypeReference<>() {};
                ResponseEntity<Map<Long, String>> response = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        typeRef
                );

                patientNameMap = response.getBody() != null ? response.getBody() : Collections.emptyMap();

            } catch (Exception e) {
                e.printStackTrace();
                patientNameMap = Collections.emptyMap();
            }
        }

        List<MedicalRecordDTO> result = new ArrayList<>();
        for (MedicalRecord record : records) {
            MedicalRecordDTO dto = new MedicalRecordDTO();
            dto.setId(record.getId());
            dto.setDoctorId(record.getDoctorId());
            dto.setDoctorName(record.getDoctorName()); // Already saved in DB
            dto.setPatientId(record.getPatientId());
            dto.setPatientName(patientNameMap.getOrDefault(record.getPatientId(), "Unknown Patient"));
            dto.setDiagnosis(record.getDiagnosis());
            dto.setTreatment(record.getTreatment());
            dto.setPrescription(record.getPrescription());
            dto.setRecordDate(record.getRecordDate());
            dto.setNotes(record.getNotes());
            result.add(dto);
        }

        return result;
    }
}




