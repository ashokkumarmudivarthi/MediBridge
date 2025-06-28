package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {

}
