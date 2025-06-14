/*package com.referencedataservice.RDSModule.controller;

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
}*/

package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.Illness;
import com.referencedataservice.RDSModule.service.IllnessService;
import com.referencedataservice.RDSModule.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<List<Illness>>> getAllIllnesses() {
        List<Illness> illnesses = illnessService.getAllIllnesses();
        return ResponseEntity.ok(new ApiResponse<>(true, "Illnesses fetched successfully", illnesses));
    }

    // GET illness by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Illness>> getIllnessById(@PathVariable Long id) {
        Illness illness = illnessService.getIllnessById(id);
        if (illness != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Illness found", illness));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Illness not found", null));
        }
    }

    // POST - Create illness
    @PostMapping
    public ResponseEntity<ApiResponse<Illness>> createIllness(@RequestBody Illness illness) {
        Illness created = illnessService.saveIllness(illness);
        return ResponseEntity.ok(new ApiResponse<>(true, "Illness created successfully", created));
    }

    // PUT - Update illness
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Illness>> updateIllness(@PathVariable Long id, @RequestBody Illness illness) {
        Illness updated = illnessService.updateIllness(id, illness);
        if (updated != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Illness updated successfully", updated));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Illness not found", null));
        }
    }

    // DELETE illness
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIllness(@PathVariable Long id) {
        boolean deleted = illnessService.deleteIllness(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Illness deleted successfully", null));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Illness not found", null));
        }
    }
}

