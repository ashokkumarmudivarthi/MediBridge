/*package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.service.ReferenceDataService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reference")
@CrossOrigin(origins = "*") // Allow frontend access from any origin
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    public ReferenceDataController(ReferenceDataService referenceDataService) {
        this.referenceDataService = referenceDataService;
    }

    @GetMapping("/{type}")
    public List<String> getReferenceDataByType(@PathVariable String type) {
        return referenceDataService.getReferenceValuesByType(type);
    }
}
*/

package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.model.ReferenceData;
import com.referencedataservice.RDSModule.service.ReferenceDataService;
import com.referencedataservice.RDSModule.utils.ApiResponse;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/reference-data")
@CrossOrigin(origins = "*")
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    public ReferenceDataController(ReferenceDataService referenceDataService) {
        this.referenceDataService = referenceDataService;
    }

    // Get all reference data
    @GetMapping
    public ApiResponse<List<ReferenceData>> getAllReferenceData() {
        List<ReferenceData> data = referenceDataService.getAllReferenceData();
        return new ApiResponse<>(true, "Fetched all reference data", data);
    }

    // Get values by type
    @GetMapping("/type/{type}")
    public ApiResponse<List<String>> getReferenceDataByType(@PathVariable String type) {
        List<String> values = referenceDataService.getReferenceValuesByType(type);
        return new ApiResponse<>(true, "Fetched values for type: " + type, values);
    }

    // Get by ID
    @GetMapping("/{id}")
    public ApiResponse<ReferenceData> getById(@PathVariable Long id) {
        ReferenceData data = referenceDataService.getReferenceDataById(id);
        if (data != null) {
            return new ApiResponse<>(true, "Reference data found", data);
        } else {
            return new ApiResponse<>(false, "Reference data not found", null);
        }
    }

    // Add new reference data
    @PostMapping
    public ApiResponse<ReferenceData> create(@RequestBody ReferenceData referenceData) {
        ReferenceData created = referenceDataService.save(referenceData);
        return new ApiResponse<>(true, "Reference data created successfully", created);
    }

    // Update existing reference data
    @PutMapping("/{id}")
    public ApiResponse<ReferenceData> update(@PathVariable Long id, @RequestBody ReferenceData updatedData) {
        ReferenceData updated = referenceDataService.updateReferenceData(id, updatedData);
        if (updated != null) {
            return new ApiResponse<>(true, "Reference data updated successfully", updated);
        } else {
            return new ApiResponse<>(false, "Reference data not found", null);
        }
    }

    // Delete by ID
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        boolean deleted = referenceDataService.deleteById(id);
        if (deleted) {
            return new ApiResponse<>(true, "Reference data deleted successfully", null);
        } else {
            return new ApiResponse<>(false, "Reference data not found", null);
        }
    }
}
