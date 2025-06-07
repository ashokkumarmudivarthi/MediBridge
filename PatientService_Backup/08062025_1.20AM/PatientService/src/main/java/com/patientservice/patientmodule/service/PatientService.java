package com.patientservice.patientmodule.service;

import com.patientservice.patientmodule.model.Patient;
import com.patientservice.patientmodule.repository.PatientRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;
    
    
    
    
    public Optional<Patient> authenticate(String username, String password) {
        return patientRepository.findByNameAndContact(username, password);
    }

    public Patient registerPatient(Patient patient) {
        // Save the patient to the database
        return patientRepository.save(patient);
    }
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

   
 // Method to delete a patient by id
    public String deletePatient(Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            patientRepository.deleteById(id);
            return "Patient with ID " + id + " deleted successfully";  // Success message
        }
        return "Patient with ID " + id + " not found";  // Not found message
    }
    
    
    public List<Patient> filterPatients(String city, String disease, String hospital) {
        if (city != null && !city.isEmpty() && disease != null && !disease.isEmpty() && hospital != null && !hospital.isEmpty()) {
            return patientRepository.findByCityAndDiseaseAndHospital(city, disease, hospital);
        } else if (city != null && !city.isEmpty()) {
            return patientRepository.findByCity(city);
        } else if (disease != null && !disease.isEmpty()) {
            return patientRepository.findByDisease(disease);
        } else if (hospital != null && !hospital.isEmpty()) {
            return patientRepository.findByHospital(hospital);
        } else {
            // If all are blank, fetch all patients
            return patientRepository.findAll();
        }
    }
    
    
}