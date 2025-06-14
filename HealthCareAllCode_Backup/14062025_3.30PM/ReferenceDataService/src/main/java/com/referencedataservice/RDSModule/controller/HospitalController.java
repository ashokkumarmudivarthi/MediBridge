package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.Hospital;
import com.referencedataservice.RDSModule.service.HospitalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    // GET all hospitals
    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalService.getAllHospitals();
    }

    // GET hospitals by city ID
    @GetMapping("/by-city/{cityId}")
    public List<Hospital> getHospitalsByCityId(@PathVariable Long cityId) {
        return hospitalService.getHospitalsByCityId(cityId);
    }

    // GET hospital by ID (optional)
    @GetMapping("/{id}")
    public Hospital getHospitalById(@PathVariable Long id) {
        return hospitalService.getHospitalById(id);
    }
}
