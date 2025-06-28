/*package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByStateId(Long stateId);
}
*/

package com.referencedataservice.RDSModule.repository;

import com.referencedataservice.RDSModule.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByStateId(Long stateId);
}
