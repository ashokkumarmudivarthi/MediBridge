/*package com.doctorservice.dm.service.impl;

import com.doctorservice.dm.model.Doctor;
import com.doctorservice.dm.repository.DoctorRepository;
import com.doctorservice.dm.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Doctor registerDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        return doctorRepository.findById(id).map(existingDoctor -> {
            existingDoctor.setDoctorName(updatedDoctor.getDoctorName());
            existingDoctor.setSpecialistIn(updatedDoctor.getSpecialistIn());
            existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
            existingDoctor.setQualifications(updatedDoctor.getQualifications());
            existingDoctor.setExperienceYears(updatedDoctor.getExperienceYears());
            existingDoctor.setPhoneNumber(updatedDoctor.getPhoneNumber());
            existingDoctor.setContactNumber(updatedDoctor.getContactNumber());
            existingDoctor.setEmail(updatedDoctor.getEmail());
            existingDoctor.setGender(updatedDoctor.getGender());
            existingDoctor.setState(updatedDoctor.getState());
            existingDoctor.setHospitalName(updatedDoctor.getHospitalName());
            existingDoctor.setAvailability(updatedDoctor.getAvailability());
            existingDoctor.setStatus(updatedDoctor.getStatus());
            return doctorRepository.save(existingDoctor);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> findDoctors(Long doctorId, String specialization) {
        if (doctorId != null && specialization != null) {
            return doctorRepository.findByIdAndSpecializationIgnoreCase(doctorId, specialization);
        } else if (doctorId != null) {
            return doctorRepository.findById(doctorId)
                    .map(List::of)
                    .orElse(List.of());
        } else if (specialization != null) {
            return doctorRepository.findBySpecializationIgnoreCase(specialization);
        } else {
            return doctorRepository.findAll();
        }
    }
}
*/



/*
 * working code fully 19/06/2025
 * package com.doctorservice.dm.service.impl;

import com.doctorservice.dm.model.Doctor;
import com.doctorservice.dm.model.Users;
import com.doctorservice.dm.repository.DoctorRepository;
import com.doctorservice.dm.repository.UserRepository;
import com.doctorservice.dm.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

   
    
    @Override
    public Doctor registerDoctor(Doctor doctor) {
        // 1. Save doctor initially to get ID
        Doctor savedDoctor = doctorRepository.save(doctor);

        // 2. Generate username: id_doctorName (sanitize doctorName)
       // String sanitizedDoctorName = savedDoctor.getDoctorName().trim().replaceAll("[^a-zA-Z0-9]", "");
       // String generatedUsername = savedDoctor.getId() + "_" + sanitizedDoctorName;
        
        String sanitizedDoctorName = savedDoctor.getDoctorName().trim().replaceAll("[^a-zA-Z0-9]", "");
        String generatedUsername = sanitizedDoctorName + savedDoctor.getId() + "@wnw.com";

        // 3. Generate password (here using contactNumber as password before encoding)
        String rawPassword = savedDoctor.getContactNumber();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 4. Update savedDoctor entity with username and encoded password
        savedDoctor.setUsername(generatedUsername);
        savedDoctor.setPassword(encodedPassword);

        // 5. Save updated doctor again
        savedDoctor = doctorRepository.save(savedDoctor);

        // 6. Create and save User entity with same credentials
        Users user = new Users();
        user.setUsername(generatedUsername);
        user.setPassword(encodedPassword);
        user.setFullName(savedDoctor.getDoctorName());
        user.setEmail(savedDoctor.getEmail());
        user.setRoleId(2L); // assuming 2L = ROLE_DOCTOR, adjust if different

        userRepository.save(user);

        return savedDoctor;
    }


    @Override
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        return doctorRepository.findById(id).map(existingDoctor -> {
            existingDoctor.setDoctorName(updatedDoctor.getDoctorName());
            existingDoctor.setSpecialistIn(updatedDoctor.getSpecialistIn());
            existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
            existingDoctor.setQualifications(updatedDoctor.getQualifications());
            existingDoctor.setExperienceYears(updatedDoctor.getExperienceYears());
            existingDoctor.setPhoneNumber(updatedDoctor.getPhoneNumber());
            existingDoctor.setContactNumber(updatedDoctor.getContactNumber());
            existingDoctor.setEmail(updatedDoctor.getEmail());
            existingDoctor.setGender(updatedDoctor.getGender());
            existingDoctor.setState(updatedDoctor.getState());
            existingDoctor.setHospitalName(updatedDoctor.getHospitalName());
            existingDoctor.setAvailability(updatedDoctor.getAvailability());
            existingDoctor.setStatus(updatedDoctor.getStatus());
            // Optionally update corresponding Users entity here (not implemented)

            return doctorRepository.save(existingDoctor);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> findDoctors(Long doctorId, String specialization) {
        if (doctorId != null && specialization != null) {
            return doctorRepository.findByIdAndSpecializationIgnoreCase(doctorId, specialization);
        } else if (doctorId != null) {
            return doctorRepository.findById(doctorId)
                    .map(List::of)
                    .orElse(List.of());
        } else if (specialization != null) {
            return doctorRepository.findBySpecializationIgnoreCase(specialization);
        } else {
            return doctorRepository.findAll();
        }
    }
    
    @Override
    public void deleteDoctorById(Long id) {
        // First check if doctor exists, else throw exception
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }
}
*/

package com.doctorservice.dm.service.impl;

import com.doctorservice.dm.model.Doctor;
import com.doctorservice.dm.model.Users;
import com.doctorservice.dm.repository.DoctorRepository;
import com.doctorservice.dm.repository.UserRepository;
import com.doctorservice.dm.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Doctor registerDoctor(Doctor doctor) {
        // 1. Generate username
        String sanitizedDoctorName = doctor.getDoctorName().trim().replaceAll("[^a-zA-Z0-9]", "");
        String generatedUsername = sanitizedDoctorName + System.currentTimeMillis() + "@wnw.com";

        // 2. Generate password using contact number
        String rawPassword = doctor.getContactNumber();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 3. Save User first
        Users user = new Users();
        user.setUsername(generatedUsername);
        user.setPassword(encodedPassword);
        user.setFullName(doctor.getDoctorName());
        user.setEmail(doctor.getEmail());
        user.setRoleId(2L); // Assuming 2 = ROLE_DOCTOR
        user = userRepository.save(user); // important: save and return to get ID

        // 4. Set user reference in Doctor
        doctor.setUsername(generatedUsername); // optional
        doctor.setPassword(encodedPassword);   // optional
        doctor.setUser(user); // important: link doctor to user

        // 5. Save Doctor
        return doctorRepository.save(doctor);
    }

    @Override
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        return doctorRepository.findById(id).map(existingDoctor -> {
            existingDoctor.setDoctorName(updatedDoctor.getDoctorName());
            existingDoctor.setSpecialistIn(updatedDoctor.getSpecialistIn());
            existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
            existingDoctor.setQualifications(updatedDoctor.getQualifications());
            existingDoctor.setExperienceYears(updatedDoctor.getExperienceYears());
            existingDoctor.setPhoneNumber(updatedDoctor.getPhoneNumber());
            existingDoctor.setContactNumber(updatedDoctor.getContactNumber());
            existingDoctor.setEmail(updatedDoctor.getEmail());
            existingDoctor.setGender(updatedDoctor.getGender());
            existingDoctor.setState(updatedDoctor.getState());
            existingDoctor.setHospitalName(updatedDoctor.getHospitalName());
            existingDoctor.setAvailability(updatedDoctor.getAvailability());
            existingDoctor.setStatus(updatedDoctor.getStatus());
            existingDoctor.setCountry(updatedDoctor.getCountry());
            existingDoctor.setCity(updatedDoctor.getCity());

            return doctorRepository.save(existingDoctor);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> findDoctors(Long doctorId, String specialization) {
        if (doctorId != null && specialization != null) {
            return doctorRepository.findByIdAndSpecializationIgnoreCase(doctorId, specialization);
        } else if (doctorId != null) {
            return doctorRepository.findById(doctorId)
                    .map(List::of)
                    .orElse(List.of());
        } else if (specialization != null) {
            return doctorRepository.findBySpecializationIgnoreCase(specialization);
        } else {
            return doctorRepository.findAll();
        }
    }

    @Override
    public void deleteDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }

    // ✅ NEW: To support /my-profile endpoint
    @Override
    public Doctor getDoctorByUsername(String username) {
        return doctorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Doctor not found with username: " + username));
    }

}



