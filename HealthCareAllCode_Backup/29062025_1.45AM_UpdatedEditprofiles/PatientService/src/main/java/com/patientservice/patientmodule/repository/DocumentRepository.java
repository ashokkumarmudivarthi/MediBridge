package com.patientservice.patientmodule.repository;



import com.patientservice.patientmodule.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByPatientId(Long patientId);
    List<Document> findByVisitId(Long visitId);
}
