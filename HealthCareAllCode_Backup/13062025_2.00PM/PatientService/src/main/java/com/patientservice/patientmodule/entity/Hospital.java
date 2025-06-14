package com.patientservice.patientmodule.entity;

//package com.wellnesswave.healthcare.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hospitalName;
    private String city;

    public Hospital() {
    }

    public Hospital(String hospitalName, String city) {
        this.hospitalName = hospitalName;
        this.city = city;
    }

    public Hospital(Object object, String string, String string2) {
		// TODO Auto-generated constructor stub
	}

	public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
