package com.patientservice.patientmodule.service;

import com.patientservice.patientmodule.dto.PatientUpdateRequest;
import com.patientservice.patientmodule.model.Patient;
import com.patientservice.patientmodule.model.Users;
import com.patientservice.patientmodule.repository.PatientRepository;
import com.patientservice.patientmodule.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

	
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<Patient> authenticate(String username, String password) {
        return patientRepository.findByNameAndContact(username, password);
    }

  /*  public Patient registerPatient(Patient patient) {
        Patient savedPatient = patientRepository.save(patient);

        Users user = new Users();
        user.setUsername(patient.getName());
        user.setPassword(passwordEncoder.encode(patient.getContact()));
        user.setFullName(patient.getName());
        user.setEmail(patient.getEmail());
      
        user.setRoleId(3L); // assuming 2 is the ID for 'ROLE_PATIENT'

        userRepository.save(user);

        return savedPatient;
    }*/
    
    public Patient registerPatient(Patient patient) {
        // 1. Save the patient first to get the generated ID
        Patient savedPatient = patientRepository.save(patient);

        // 2. Generate a unique username using name + ID
        String sanitizedName = savedPatient.getName().trim().replaceAll("[^a-zA-Z0-9]", "");
        String generatedUsername = sanitizedName + savedPatient.getId();  // e.g., Ashok5

        savedPatient.setUsername(generatedUsername);
        patientRepository.save(savedPatient); // update patient with username
        
        // 3. Create User entity with generated username
        Users user = new Users();
        user.setUsername(generatedUsername);
        user.setPassword(passwordEncoder.encode(savedPatient.getContact())); // You can change this if needed
        user.setFullName(savedPatient.getName());
        user.setEmail(savedPatient.getEmail());
        user.setRoleId(3L); // assuming 3 is the ID for 'ROLE_PATIENT'

        userRepository.save(user);

        return savedPatient;
    }


    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public String deletePatient(Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            patientRepository.deleteById(id);
            return "Patient with ID " + id + " deleted successfully";
        }
        return "Patient with ID " + id + " not found";
    }

    public List filterPatients(String city, String disease, String hospital) {
        if (city != null && !city.isEmpty() && disease != null && !disease.isEmpty() && hospital != null && !hospital.isEmpty()) {
            return patientRepository.findByCityAndDiseaseAndHospital(city, disease, hospital);
        } else if (city != null && !city.isEmpty()) {
            return patientRepository.findByCity(city);
        } else if (disease != null && !disease.isEmpty()) {
          //  return patientRepository.findByDisease(disease);
        	 return patientRepository.findByDisease(disease);
        } else if (hospital != null && !hospital.isEmpty()) {
            return patientRepository.findByHospital(hospital);
        } else {
            return patientRepository.findAll();
        }
    }
    
    public long getPatientsCount() {
        return patientRepository.count();
    }
    
  //Newly Added endpoint date 10/06/2025  
    public Patient updatePatient(Long id, PatientUpdateRequest updateRequest) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        if (optionalPatient.isEmpty()) {
            throw new RuntimeException("Patient not found with id: " + id);
        }
        Patient patient = optionalPatient.get();

        // Update fields (modify as per your needs)
        patient.setName(updateRequest.getName());
        patient.setAge(updateRequest.getAge());
        patient.setGender(updateRequest.getGender());
        patient.setDob(updateRequest.getDob());
        patient.setContact(updateRequest.getContact());
        patient.setEmail(updateRequest.getEmail());
        patient.setBloodGroup(updateRequest.getBloodGroup());
        patient.setSpecialist(updateRequest.getSpecialist());
        patient.setHospital(updateRequest.getHospital());
        patient.setEmergencyContact(updateRequest.getEmergencyContact());
        patient.setMedicalHistory(updateRequest.getMedicalHistory());
        patient.setAddress(updateRequest.getAddress());
        patient.setCountry(updateRequest.getCountry());
        patient.setState(updateRequest.getState());
        patient.setCity(updateRequest.getCity());
        patient.setPincode(updateRequest.getPincode());
        patient.setDisease(updateRequest.getDisease());
        patient.setExistingIllnesses(updateRequest.getExistingIllnesses());

        return patientRepository.save(patient);
    }
    
}
