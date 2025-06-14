package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.Disease;
import com.referencedataservice.RDSModule.service.DiseaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases")
@CrossOrigin(origins = "*")
public class DiseaseController {

    private final DiseaseService diseaseService;

    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    // GET all diseases
    @GetMapping
    public List<Disease> getAllDiseases() {
        return diseaseService.getAllDiseases();
    }

    // GET disease by ID
    @GetMapping("/{id}")
    public Disease getDiseaseById(@PathVariable Long id) {
        return diseaseService.getDiseaseById(id);
    }
}
