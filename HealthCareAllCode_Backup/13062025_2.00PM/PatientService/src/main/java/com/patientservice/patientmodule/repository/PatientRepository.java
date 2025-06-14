package com.patientservice.patientmodule.repository;



import com.patientservice.patientmodule.model.Patient;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
	//Optional<Patient> findByUsernameAndPassword(String username, String password);
	
	Optional<Patient> findByNameAndContact(String name, String contact);
	
	 List<Patient> findByCityContainingIgnoreCase(String city);
	    List<Patient> findByDiseaseContainingIgnoreCase(String disease);
	    List<Patient> findByHospitalContainingIgnoreCase(String hospital);

		//List<Patient> findByCityAndDiseaseAndHospital(String city, String disease, String hospital);
		
		 List<Patient> findByCity(String city);
		    List findByDisease(String disease);
		    List<Patient> findByHospital(String hospital);
		    List findByCityAndDiseaseAndHospital(String city, String disease, String hospital);
		
}

