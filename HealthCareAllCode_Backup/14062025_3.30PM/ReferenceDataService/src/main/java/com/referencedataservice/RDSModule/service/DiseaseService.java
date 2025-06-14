package com.referencedataservice.RDSModule.service;

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
}
