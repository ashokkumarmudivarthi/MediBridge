package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.Country;
import com.referencedataservice.RDSModule.repository.CountryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
public class CountryService {

    private static final Logger logger = LoggerFactory.getLogger(CountryService.class);

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    // ✅ Fetch all countries
    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    // ✅ Fetch single country by ID
    public Country getCountryById(Long id) {
        return countryRepository.findById(id).orElse(null);
    }

    // ✅ Create a new country
    public Country createCountry(Country country) {
        if (country.getName() == null || country.getCode() == null) {
            logger.warn("Country creation failed due to missing name or code.");
            throw new IllegalArgumentException("Country name and code must not be null");
        }
        logger.info("Saving new country: {} - {}", country.getName(), country.getCode());
        return countryRepository.save(country);
    }

    // ✅ Update existing country
    public Country updateCountry(Long id, Country countryDetails) {
        Optional<Country> optionalCountry = countryRepository.findById(id);
        if (optionalCountry.isPresent()) {
            Country country = optionalCountry.get();
            country.setName(countryDetails.getName());
            country.setCode(countryDetails.getCode()); // Add this if you have a 'code' field too
            logger.info("Updating country with ID {} to name={}, code={}", id, country.getName(), country.getCode());
            return countryRepository.save(country);
        } else {
            logger.warn("Update failed: Country with ID {} not found.", id);
            return null; // Or throw new ResourceNotFoundException("Country not found with ID: " + id);
        }
    }

   // private static final Logger logger = LoggerFactory.getLogger(CountryService.class);

    // Dummy implementation: delete country if id is even, else not found
    public boolean deleteCountry(Long id) {
        logger.info("Attempting to delete country with ID: {}", id);

        // Simulate database delete operation
        if (id != null && id % 2 == 0) {
            logger.info("Simulated: Country with ID {} deleted.", id);
            return true;
        } else {
            logger.info("Simulated: Country with ID {} not found.", id);
            return false;
        }
    }
}
