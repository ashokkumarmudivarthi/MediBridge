package com.referencedataservice.RDSModule.controller;

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
