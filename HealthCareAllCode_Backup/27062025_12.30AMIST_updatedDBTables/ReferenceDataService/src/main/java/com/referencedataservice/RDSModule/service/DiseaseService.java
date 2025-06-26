/*package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.Disease;
import com.referencedataservice.RDSModule.repository.DiseaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;

    public DiseaseService(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    public Disease getDiseaseById(Long id) {
        return diseaseRepository.findById(id).orElse(null);
    }
}*/

package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.Disease;
import com.referencedataservice.RDSModule.repository.DiseaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;

    public DiseaseService(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    public Disease getDiseaseById(Long id) {
        return diseaseRepository.findById(id).orElse(null);
    }

    public Disease saveDisease(Disease disease) {
        return diseaseRepository.save(disease);
    }

    public Disease updateDisease(Long id, Disease diseaseDetails) {
        Optional<Disease> optionalDisease = diseaseRepository.findById(id);
        if (optionalDisease.isPresent()) {
            Disease existing = optionalDisease.get();
            existing.setName(diseaseDetails.getName());
            return diseaseRepository.save(existing);
        }
        return null;
    }

    public boolean deleteDisease(Long id) {
        Optional<Disease> optionalDisease = diseaseRepository.findById(id);
        if (optionalDisease.isPresent()) {
            diseaseRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

