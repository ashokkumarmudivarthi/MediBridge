package com.referencedataservice.RDSModule.service;

import java.util.List;

public interface ReferenceDataService {
    List<String> getReferenceValuesByType(String type);
}
