/*package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.City;
import com.referencedataservice.RDSModule.service.CityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "*")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    // GET all cities
    @GetMapping
    public List<City> getAllCities() {
        return cityService.getAllCities();
    }

    // GET cities by state ID
    @GetMapping("/by-state/{stateId}")
    public List<City> getCitiesByStateId(@PathVariable Long stateId) {
        return cityService.getCitiesByStateId(stateId);
    }

    // GET city by ID (optional)
    @GetMapping("/{id}")
    public City getCityById(@PathVariable Long id) {
        return cityService.getCityById(id);
    }
}*/

package com.referencedataservice.RDSModule.controller;

import com.referencedataservice.RDSModule.entity.City;
import com.referencedataservice.RDSModule.service.CityService;
import com.referencedataservice.RDSModule.utils.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "*")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<City>>> getAllCities() {
        List<City> cities = cityService.getAllCities();
        return ResponseEntity.ok(new ApiResponse<>(true, "All cities fetched", cities));
    }

    @GetMapping("/by-state/{stateId}")
    public ResponseEntity<ApiResponse<List<City>>> getCitiesByStateId(@PathVariable Long stateId) {
        List<City> cities = cityService.getCitiesByStateId(stateId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cities for state fetched", cities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<City>> getCityById(@PathVariable Long id) {
        return cityService.getCityById(id)
                .map(city -> ResponseEntity.ok(new ApiResponse<>(true, "City found", city)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "City not found", null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<City>> addCity(@RequestBody City city) {
        City saved = cityService.saveCity(city);
        return ResponseEntity.ok(new ApiResponse<>(true, "City saved successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<City>> updateCity(@PathVariable Long id, @RequestBody City city) {
        city.setId(id);
        City updated = cityService.saveCity(city);
        return ResponseEntity.ok(new ApiResponse<>(true, "City updated successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCity(@PathVariable Long id) {
        boolean deleted = cityService.deleteCityIfNoHospitals(id);
        if (deleted) {
            return ResponseEntity.ok("City deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cannot delete city as it is referenced by one or more hospitals.");
        }
    }


  /*  @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "City deleted successfully", null));
    }*/
}

