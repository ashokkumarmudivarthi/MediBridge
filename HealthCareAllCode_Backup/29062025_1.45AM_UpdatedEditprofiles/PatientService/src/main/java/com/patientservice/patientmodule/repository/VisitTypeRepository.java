package com.patientservice.patientmodule.repository;



import com.patientservice.patientmodule.entity.PatientVisitType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitTypeRepository extends JpaRepository<PatientVisitType, Long> {
    List<PatientVisitType> findByPatientId(Long patientId);
}
