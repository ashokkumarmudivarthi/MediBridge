package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.entity.State;
import com.referencedataservice.RDSModule.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StateRepository extends JpaRepository<State, Long> {
    List<State> findByCountryId(Long countryId);
}
