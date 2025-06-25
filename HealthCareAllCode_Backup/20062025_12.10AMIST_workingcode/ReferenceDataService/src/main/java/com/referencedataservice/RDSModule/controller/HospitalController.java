/*package com.referencedataservice.RDSModule.controller;

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
}*/

package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.Hospital;
import com.referencedataservice.RDSModule.service.HospitalService;
import com.referencedataservice.RDSModule.utils.ApiResponse;
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

    @GetMapping
    public ApiResponse<List<Hospital>> getAllHospitals() {
        List<Hospital> hospitals = hospitalService.getAllHospitals();
        return new ApiResponse<>(true, "Hospitals retrieved successfully", hospitals);
    }

    @GetMapping("/{id}")
    public ApiResponse<Hospital> getHospitalById(@PathVariable Long id) {
        Hospital hospital = hospitalService.getHospitalById(id);
        if (hospital != null) {
            return new ApiResponse<>(true, "Hospital found", hospital);
        } else {
            return new ApiResponse<>(false, "Hospital not found", null);
        }
    }

    @GetMapping("/by-city/{cityId}")
    public ApiResponse<List<Hospital>> getHospitalsByCityId(@PathVariable Long cityId) {
        List<Hospital> hospitals = hospitalService.getHospitalsByCityId(cityId);
        return new ApiResponse<>(true, "Hospitals by city retrieved successfully", hospitals);
    }

    @PostMapping
    public ApiResponse<Hospital> createHospital(@RequestBody Hospital hospital) {
        Hospital savedHospital = hospitalService.saveHospital(hospital);
        return new ApiResponse<>(true, "Hospital created successfully", savedHospital);
    }

    @PutMapping("/{id}")
    public ApiResponse<Hospital> updateHospital(@PathVariable Long id, @RequestBody Hospital updatedHospital) {
        Hospital hospital = hospitalService.updateHospital(id, updatedHospital);
        if (hospital != null) {
            return new ApiResponse<>(true, "Hospital updated successfully", hospital);
        } else {
            return new ApiResponse<>(false, "Hospital not found", null);
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteHospital(@PathVariable Long id) {
        boolean deleted = hospitalService.deleteHospital(id);
        if (deleted) {
            return new ApiResponse<>(true, "Hospital deleted successfully", null);
        } else {
            return new ApiResponse<>(false, "Hospital not found or could not be deleted", null);
        }
    }
}

