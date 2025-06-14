package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.City;
import com.referencedataservice.RDSModule.repository.CityRepository;
import com.referencedataservice.RDSModule.repository.HospitalRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final HospitalRepository hospitalRepository;

    public CityService(CityRepository cityRepository, HospitalRepository hospitalRepository) {
        this.cityRepository = cityRepository;
        this.hospitalRepository = hospitalRepository;
    }

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    public List<City> getCitiesByStateId(Long stateId) {
        return cityRepository.findByStateId(stateId);
    }

    public Optional<City> getCityById(Long id) {
        return cityRepository.findById(id);
    }

    public City saveCity(City city) {
        return cityRepository.save(city);
    }

    public boolean isCityDeletable(Long cityId) {
        // Prevent delete if any hospital exists in this city
        return hospitalRepository.findByCityId(cityId).isEmpty();
    }

    public boolean deleteCityIfNoHospitals(Long id) {
        if (isCityDeletable(id)) {
            cityRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
