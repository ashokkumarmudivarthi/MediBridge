package com.patientservice.patientmodule.dto;

//package com.wellnesswave.healthcare.dto;

public class PatientDTO {
    private String patientId;
    private String name; // assuming you have a name field

    public PatientDTO() {}

    public PatientDTO(String patientId, String name) {
        this.patientId = patientId;
        this.name = name;
    }

    public String getPatientId() {
        return patientId;
    }
    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
