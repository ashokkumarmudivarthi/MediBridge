package com.patientservice.patientmodule.response;

//package com.wellnesswave.healthcare.response;

import com.patientservice.patientmodule.model.Patient;

public class PatientResponse {
    private String message;
    private Patient patient;

    // Constructor
    public PatientResponse(String message, Patient patient) {
        this.message = message;
        this.patient = patient;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
