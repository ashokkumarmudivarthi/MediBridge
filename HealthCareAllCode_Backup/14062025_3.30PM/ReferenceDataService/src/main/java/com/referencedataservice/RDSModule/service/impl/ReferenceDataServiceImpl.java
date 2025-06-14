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
}
