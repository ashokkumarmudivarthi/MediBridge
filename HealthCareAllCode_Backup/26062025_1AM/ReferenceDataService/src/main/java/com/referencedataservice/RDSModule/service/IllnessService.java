/*package com.referencedataservice.RDSModule.service;

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
}*/

package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.Illness;
import com.referencedataservice.RDSModule.repository.IllnessRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Illness saveIllness(Illness illness) {
        return illnessRepository.save(illness);
    }

    public Illness updateIllness(Long id, Illness illnessDetails) {
        Optional<Illness> optionalIllness = illnessRepository.findById(id);
        if (optionalIllness.isPresent()) {
            Illness illness = optionalIllness.get();
            illness.setName(illnessDetails.getName());
            return illnessRepository.save(illness);
        }
        return null;
    }

    public boolean deleteIllness(Long id) {
        if (illnessRepository.existsById(id)) {
            illnessRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

