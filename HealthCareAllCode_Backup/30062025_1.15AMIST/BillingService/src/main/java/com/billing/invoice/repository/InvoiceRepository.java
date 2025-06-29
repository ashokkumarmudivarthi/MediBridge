package com.billing.invoice.repository;

import com.billing.invoice.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByPatientId(Long patientId);
    List<Invoice> findByDoctorId(Long doctorId);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}
