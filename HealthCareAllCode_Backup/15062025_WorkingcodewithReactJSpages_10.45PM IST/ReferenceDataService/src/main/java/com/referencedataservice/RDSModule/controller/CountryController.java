package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.Country;
import com.referencedataservice.RDSModule.service.CountryService;

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
@RequestMapping("/api/countries")
@CrossOrigin(origins = "*")
public class CountryController {

    private static final Logger logger = LoggerFactory.getLogger(CountryController.class);
    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    // ✅ GET: List all countries
    @GetMapping
    public List<Country> getAllCountries() {
        return countryService.getAllCountries();
    }

    // ✅ GET: Country by ID
    @GetMapping("/{id}")
    public Country getCountryById(@PathVariable Long id) {
        return countryService.getCountryById(id);
    }

    // ✅ POST: Create a new country
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Country createCountryNew(@Valid @RequestBody Country country) {
        logger.info("POST /api/countries/create called with name: {}, code: {}", country.getName(), country.getCode());
        return countryService.createCountry(country);
    }


    // ✅ PUT: Update existing country
    @PutMapping("/{id}")
    public Country updateCountry(@PathVariable Long id, @RequestBody Country country) {
        return countryService.updateCountry(id, country);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCountry(@PathVariable Long id) {
        logger.info("DELETE /api/countries/{} called", id);

        boolean deleted;
        try {
            deleted = countryService.deleteCountry(id);
            logger.info("countryService.deleteCountry({}) returned {}", id, deleted);
        } catch (Exception e) {
            logger.error("Exception in deleteCountry: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Exception occurred while deleting country with ID " + id);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }

        Map<String, Object> response = new HashMap<>();
        if (deleted) {
            response.put("status", "success");
            response.put("message", "✅ Country with ID " + id + " deleted successfully.");
            logger.info("Returning success response for delete");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "❌ Country with ID " + id + " not found.");
            logger.info("Returning not found response for delete");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }



    // ✅ TEST: Simple GET endpoint to test GET call
    @GetMapping("/test")
    public String testGetEndpoint() {
        return "GET /api/countries/test is working!";
    }
}
