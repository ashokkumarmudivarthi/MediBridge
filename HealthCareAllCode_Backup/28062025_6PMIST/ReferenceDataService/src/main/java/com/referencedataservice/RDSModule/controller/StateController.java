package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.State;
import com.referencedataservice.RDSModule.entity.Country;
import com.referencedataservice.RDSModule.service.StateService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/states")
@CrossOrigin(origins = "*")
public class StateController {

    private static final Logger logger = LoggerFactory.getLogger(StateController.class);
    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    // ✅ GET: Get all states
    @GetMapping
    public ResponseEntity<List<State>> getAllStates() {
        logger.info("GET /api/states called");
        List<State> states = stateService.getAllStates();
        return ResponseEntity.ok(states);
    }

    // ✅ GET: Get states by country ID
    @GetMapping("/by-country/{countryId}")
    public ResponseEntity<List<State>> getStatesByCountryId(@PathVariable Long countryId) {
        logger.info("GET /api/states/by-country/{} called", countryId);
        List<State> states = stateService.getStatesByCountryId(countryId);
        if (states.isEmpty()) {
            logger.warn("No states found for country ID: {}", countryId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(states);
        }
        return ResponseEntity.ok(states);
    }

    // ✅ GET: Get state by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStateById(@PathVariable Long id) {
        logger.info("GET /api/states/{} called", id);
        State state = stateService.getStateById(id);
        if (state == null) {
            logger.warn("State not found with ID: {}", id);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "State with ID " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.ok(state);
    }

    // ✅ POST: Create a new state
    @PostMapping("/create")
    public ResponseEntity<?> createState(@Valid @RequestBody State state) {
        logger.info("POST /api/states/create called with name: {}, code: {}, countryId: {}",
                state.getName(), state.getCode(), state.getCountry() != null ? state.getCountry().getId() : null);

        try {
            State createdState = stateService.createState(state);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdState);
        } catch (Exception e) {
            logger.error("Error creating state: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to create state: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // ✅ PUT: Update existing state
    @PutMapping("/{id}")
    public ResponseEntity<?> updateState(@PathVariable Long id, @RequestBody State state) {
        logger.info("PUT /api/states/{} called to update state", id);

        try {
            State updatedState = stateService.updateState(id, state);
            if (updatedState == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "State with ID " + id + " not found.");
                logger.warn("State with ID {} not found for update", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            return ResponseEntity.ok(updatedState);
        } catch (Exception e) {
            logger.error("Error updating state: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to update state: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // ✅ DELETE: Delete state by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteState(@PathVariable Long id) {
        logger.info("DELETE /api/states/{} called", id);

        boolean deleted = stateService.deleteState(id);
        Map<String, Object> response = new HashMap<>();

        if (deleted) {
            response.put("status", "success");
            response.put("message", "✅ State with ID " + id + " deleted successfully.");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "❌ State with ID " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
