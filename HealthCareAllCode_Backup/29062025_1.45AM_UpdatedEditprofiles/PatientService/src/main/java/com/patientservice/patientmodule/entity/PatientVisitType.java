package com.patientservice.patientmodule.entity;



/*import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_visit_type")
@Data
public class PatientVisitType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long visitId;

    private Long patientId;

    private String visitType; // in-patient or out-patient

    private LocalDateTime admissionDate;
    private LocalDateTime dischargeDate;
    private String roomNumber;
    private Long assignedDoctorId;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}*/


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "patient_visit_type")
public class PatientVisitType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long visitId;

    private Long patientId;
    private String visitType;
    private LocalDateTime admissionDate;
    private LocalDateTime dischargeDate;
    private String roomNumber;
    private Long assignedDoctorId;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

