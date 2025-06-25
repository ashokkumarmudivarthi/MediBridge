/*package com.doctorservice.dm.service;

import com.wellnesswave.healthcare.model.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorService {

    Doctor registerDoctor(Doctor doctor);

    Optional<com.doctorservice.dm.model.Doctor> getDoctorById(Long id);

    Doctor updateDoctor(Long id, Doctor doctor);

    List<Doctor> getAllDoctors();

    List<Doctor> findDoctors(Long doctorId, String specialization);

	com.doctorservice.dm.model.Doctor registerDoctor(com.doctorservice.dm.model.Doctor doctor);

	com.doctorservice.dm.model.Doctor updateDoctor(Long id, com.doctorservice.dm.model.Doctor updatedDoctor);
}*/

package com.doctorservice.dm.service;

import com.doctorservice.dm.model.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorService {

    Doctor registerDoctor(Doctor doctor);

    Optional<Doctor> getDoctorById(Long id);

    Doctor updateDoctor(Long id, Doctor doctor);

    List<Doctor> getAllDoctors();

    List<Doctor> findDoctors(Long doctorId, String specialization);
    void deleteDoctorById(Long id);
    Doctor getDoctorByUsername(String username);

}

