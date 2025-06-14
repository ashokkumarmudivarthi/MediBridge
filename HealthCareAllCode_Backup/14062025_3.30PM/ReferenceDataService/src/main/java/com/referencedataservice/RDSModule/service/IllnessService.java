package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.Illness;
import com.referencedataservice.RDSModule.repository.IllnessRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IllnessService {

    private final IllnessRepository illnessRepository;

    public IllnessService(IllnessRepository illnessRepository) {
        this.illnessRepository = illnessRepository;
    }

    public List<Illness> getAllIllnesses() {
        return illnessRepository.findAll();
    }

    public Illness getIllnessById(Long id) {
        return illnessRepository.findById(id).orElse(null);
    }
}
