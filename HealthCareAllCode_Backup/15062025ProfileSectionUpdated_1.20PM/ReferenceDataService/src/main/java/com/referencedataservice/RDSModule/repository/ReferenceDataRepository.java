package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.model.ReferenceData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReferenceDataRepository extends JpaRepository<ReferenceData, Long> {
    List<ReferenceData> findByType(String type);
}
