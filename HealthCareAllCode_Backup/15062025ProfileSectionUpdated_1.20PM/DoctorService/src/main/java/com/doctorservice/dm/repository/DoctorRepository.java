/*package com.doctorservice.dm.repository;

import com.doctorservice.dm.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    List<Doctor> findByIdAndSpecializationIgnoreCase(Long id, String specialization);
}
*/

package com.doctorservice.dm.repository;

import com.doctorservice.dm.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // Find all doctors with given specialization (case-insensitive)
    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    // Find doctors matching both ID and specialization (case-insensitive)
    List<Doctor> findByIdAndSpecializationIgnoreCase(Long id, String specialization);
    
    // Optional: Find doctors by name containing a string (case-insensitive) - useful for search
    List<Doctor> findByDoctorNameContainingIgnoreCase(String doctorName);
}
