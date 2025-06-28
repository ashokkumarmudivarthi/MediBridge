package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.entity.Illness;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IllnessRepository extends JpaRepository<Illness, Long> {
    // Custom queries if needed
}
