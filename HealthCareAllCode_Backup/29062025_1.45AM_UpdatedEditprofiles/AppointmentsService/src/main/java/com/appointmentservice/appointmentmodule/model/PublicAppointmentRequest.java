package com.appointmentservice.appointmentmodule.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "public_appointment_requests")
@Data
public class PublicAppointmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "contact")
    private String contact;

    @Column(name = "email")
    private String email;

    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status")
    private String status = "Pending";
}
