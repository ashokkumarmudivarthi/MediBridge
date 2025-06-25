package com.medicalrecordsservice.mrs.dto;



import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicalRecordDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private LocalDate recordDate;
    private String notes;
    private String doctorName;
}
