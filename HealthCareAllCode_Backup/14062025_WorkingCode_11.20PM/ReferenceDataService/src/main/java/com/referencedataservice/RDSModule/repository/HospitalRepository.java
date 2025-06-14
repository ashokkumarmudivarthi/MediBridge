package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByCityId(Long cityId);
}
