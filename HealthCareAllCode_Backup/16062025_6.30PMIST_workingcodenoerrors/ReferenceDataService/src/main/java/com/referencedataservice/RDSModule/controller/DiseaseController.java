/*package com.referencedataservice.RDSModule.controller;

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
}*/

package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.Disease;
import com.referencedataservice.RDSModule.service.DiseaseService;
import com.referencedataservice.RDSModule.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<List<Disease>>> getAllDiseases() {
        List<Disease> diseases = diseaseService.getAllDiseases();
        return ResponseEntity.ok(new ApiResponse<>(true, "Diseases fetched successfully", diseases));
    }

    // GET disease by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Disease>> getDiseaseById(@PathVariable Long id) {
        Disease disease = diseaseService.getDiseaseById(id);
        if (disease != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Disease found", disease));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Disease not found", null));
        }
    }

    // POST - Create new disease
    @PostMapping
    public ResponseEntity<ApiResponse<Disease>> createDisease(@RequestBody Disease disease) {
        Disease saved = diseaseService.saveDisease(disease);
        return ResponseEntity.ok(new ApiResponse<>(true, "Disease created successfully", saved));
    }

    // PUT - Update existing disease
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Disease>> updateDisease(@PathVariable Long id, @RequestBody Disease diseaseDetails) {
        Disease updated = diseaseService.updateDisease(id, diseaseDetails);
        if (updated != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Disease updated successfully", updated));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Disease not found", null));
        }
    }

    // DELETE - Delete disease
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDisease(@PathVariable Long id) {
        boolean deleted = diseaseService.deleteDisease(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Disease deleted successfully", null));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Disease not found", null));
        }
    }
}

