package com.patientservice.patientmodule.service.impl;



import com.patientservice.patientmodule.entity.PatientVisitType;
import com.patientservice.patientmodule.model.Patient;
import com.patientservice.patientmodule.repository.PatientRepository;
import com.patientservice.patientmodule.repository.VisitTypeRepository;
import com.patientservice.patientmodule.service.VisitTypeService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VisitTypeServiceImpl implements VisitTypeService {

    private final VisitTypeRepository visitRepo;
    private final PatientRepository patientRepo;

    public VisitTypeServiceImpl(VisitTypeRepository visitRepo, PatientRepository patientRepo) {
        this.visitRepo = visitRepo;
        this.patientRepo = patientRepo;
    }

    @Override
    public PatientVisitType createVisit(PatientVisitType visit) {
        return visitRepo.save(visit);
    }

    @Override
    public List<PatientVisitType> getVisitsByPatientId(Long patientId) {
        return visitRepo.findByPatientId(patientId);
    }

    // ✅ Method 1: Get visits by username
    @Override
    public List<PatientVisitType> getVisitsByUsername(String username) {
        Optional<Patient> patientOpt = patientRepo.findByUsername(username);
        if (patientOpt.isEmpty()) {
            throw new RuntimeException("Patient not found for username: " + username);
        }
        Patient patient = patientOpt.get();
        return visitRepo.findByPatientId(patient.getId());
    }

    // ✅ Method 2: Update visit status
   /* @Override
    public PatientVisitType updateVisitStatus(Long visitId, String status) {
        Optional<PatientVisitType> visitOpt = visitRepo.findById(visitId);
        if (visitOpt.isEmpty()) {
            throw new RuntimeException("Visit not found with ID: " + visitId);
        }
        PatientVisitType visit = visitOpt.get();
        visit.setStatus(status);
        return visitRepo.save(visit);
    }*/
    
    @Override
    public PatientVisitType updateVisitStatus(Long visitId, String status) {
        PatientVisitType visit = visitRepo.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found with ID: " + visitId));

        visit.setStatus(status);

        // ✅ Automatically update discharge date if status is "Discharged"
        if ("Discharged".equalsIgnoreCase(status) && visit.getDischargeDate() == null) {
            visit.setDischargeDate(LocalDateTime.now());
        }

        // `updatedAt` will be auto-updated by @PreUpdate (already handled)
        return visitRepo.save(visit);
    }

}

