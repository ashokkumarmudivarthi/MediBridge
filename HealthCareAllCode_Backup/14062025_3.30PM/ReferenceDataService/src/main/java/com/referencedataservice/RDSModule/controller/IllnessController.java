package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.Illness;
import com.referencedataservice.RDSModule.service.IllnessService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/illnesses")
@CrossOrigin(origins = "*")
public class IllnessController {

    private final IllnessService illnessService;

    public IllnessController(IllnessService illnessService) {
        this.illnessService = illnessService;
    }

    // GET all illnesses
    @GetMapping
    public List<Illness> getAllIllnesses() {
        return illnessService.getAllIllnesses();
    }

    // GET illness by ID
    @GetMapping("/{id}")
    public Illness getIllnessById(@PathVariable Long id) {
        return illnessService.getIllnessById(id);
    }
}
