package com.billing.invoice.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "invoices")
@Data  // ✅ This adds getters, setters, toString, equals, etc.
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String invoiceNumber;

    private Long patientId;
    private Long doctorId;

    private BigDecimal amount;

    private LocalDate dateIssued;
    private LocalDate dueDate;

    private String status;
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
}

