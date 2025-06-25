/*package com.referencedataservice.RDSModule.service.impl;

import com.referencedataservice.RDSModule.model.ReferenceData;
import com.referencedataservice.RDSModule.repository.ReferenceDataRepository;
import com.referencedataservice.RDSModule.service.ReferenceDataService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReferenceDataServiceImpl implements ReferenceDataService {

    private final ReferenceDataRepository referenceDataRepository;

    public ReferenceDataServiceImpl(ReferenceDataRepository referenceDataRepository) {
        this.referenceDataRepository = referenceDataRepository;
    }

    @Override
    public List<String> getReferenceValuesByType(String type) {
        return referenceDataRepository.findByType(type)
                .stream()
                .map(ReferenceData::getValue)
                .collect(Collectors.toList());
    }
}*/

package com.referencedataservice.RDSModule.service.impl;

import com.referencedataservice.RDSModule.model.ReferenceData;
import com.referencedataservice.RDSModule.repository.ReferenceDataRepository;
import com.referencedataservice.RDSModule.service.ReferenceDataService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReferenceDataServiceImpl implements ReferenceDataService {

    private final ReferenceDataRepository referenceDataRepository;

    public ReferenceDataServiceImpl(ReferenceDataRepository referenceDataRepository) {
        this.referenceDataRepository = referenceDataRepository;
    }

    @Override
    public List<String> getReferenceValuesByType(String type) {
        return referenceDataRepository.findByType(type)
                .stream()
                .map(ReferenceData::getValue)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceData> getAllReferenceData() {
        return referenceDataRepository.findAll();
    }

    @Override
    public ReferenceData getReferenceDataById(Long id) {
        return referenceDataRepository.findById(id).orElse(null);
    }

    @Override
    public ReferenceData save(ReferenceData referenceData) {
        return referenceDataRepository.save(referenceData);
    }

    @Override
    public ReferenceData updateReferenceData(Long id, ReferenceData newData) {
        return referenceDataRepository.findById(id).map(existing -> {
            existing.setType(newData.getType());
            existing.setValue(newData.getValue());
            return referenceDataRepository.save(existing);
        }).orElse(null);
    }

    @Override
    public boolean deleteById(Long id) {
        if (referenceDataRepository.existsById(id)) {
            referenceDataRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

