/*package com.referencedataservice.RDSModule.service;

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
}*/

package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.Hospital;
import com.referencedataservice.RDSModule.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Hospital saveHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(Long id, Hospital updatedHospital) {
        Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
        if (optionalHospital.isPresent()) {
            Hospital hospital = optionalHospital.get();
            hospital.setName(updatedHospital.getName());
            hospital.setCity(updatedHospital.getCity());
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public boolean deleteHospital(Long id) {
        Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
        if (optionalHospital.isPresent()) {
            hospitalRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

