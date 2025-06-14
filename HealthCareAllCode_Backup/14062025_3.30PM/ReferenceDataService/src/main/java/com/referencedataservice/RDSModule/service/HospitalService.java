package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.Hospital;
import com.referencedataservice.RDSModule.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public List<Hospital> getHospitalsByCityId(Long cityId) {
        return hospitalRepository.findByCityId(cityId);
    }

    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id).orElse(null);
    }
}
