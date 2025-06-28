package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    // Additional query methods if needed
}
