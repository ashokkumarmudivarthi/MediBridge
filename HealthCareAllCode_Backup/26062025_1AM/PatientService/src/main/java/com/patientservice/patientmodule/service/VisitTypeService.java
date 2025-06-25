package com.patientservice.patientmodule.service;



import com.patientservice.patientmodule.entity.PatientVisitType;
import java.util.List;

public interface VisitTypeService {
    PatientVisitType createVisit(PatientVisitType visit);
    List<PatientVisitType> getVisitsByPatientId(Long patientId);
    // 🔽 Add these two methods
    List<PatientVisitType> getVisitsByUsername(String username);
    PatientVisitType updateVisitStatus(Long visitId, String status);
}
