/*package com.referencedataservice.RDSModule.service;

import java.util.List;

public interface ReferenceDataService {
    List<String> getReferenceValuesByType(String type);
}*/

package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.model.ReferenceData;

import java.util.List;

public interface ReferenceDataService {
    List<String> getReferenceValuesByType(String type);
    List<ReferenceData> getAllReferenceData();
    ReferenceData getReferenceDataById(Long id);
    ReferenceData save(ReferenceData referenceData);
    ReferenceData updateReferenceData(Long id, ReferenceData newData);
    boolean deleteById(Long id);
}

