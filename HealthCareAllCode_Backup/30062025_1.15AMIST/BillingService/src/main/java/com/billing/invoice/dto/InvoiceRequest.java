package com.billing.invoice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class InvoiceRequest {
    private Long patientId;
    private Long doctorId;
    private BigDecimal amount;
    private LocalDate dueDate;
    private String notes;
}
