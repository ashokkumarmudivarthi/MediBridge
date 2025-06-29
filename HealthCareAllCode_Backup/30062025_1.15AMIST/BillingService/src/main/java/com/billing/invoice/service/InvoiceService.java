package com.billing.invoice.service;

import com.billing.invoice.dto.InvoiceRequest;
import com.billing.invoice.entity.Invoice;
import com.billing.invoice.repository.InvoiceRepository;
import com.billing.invoice.util.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Optional<Invoice> createInvoice(InvoiceRequest request) {
        if (request.getPatientId() == null || request.getDoctorId() == null ||
            request.getAmount() == null || request.getDueDate() == null ||
            request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return Optional.empty();
        }

        Invoice invoice = new Invoice();
        invoice.setPatientId(request.getPatientId());
        invoice.setDoctorId(request.getDoctorId());
        invoice.setAmount(request.getAmount());
        invoice.setDueDate(request.getDueDate());
        invoice.setNotes(request.getNotes());
        invoice.setDateIssued(LocalDate.now());
        invoice.setStatus("Pending");

        String invoiceNumber = "INV-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + String.format("%04d", new Random().nextInt(9999));
        invoice.setInvoiceNumber(invoiceNumber);

        Invoice saved = invoiceRepository.save(invoice);
        return Optional.of(saved);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public List<Invoice> getByPatientId(Long patientId) {
        return invoiceRepository.findByPatientId(patientId);
    }

    public Optional<Invoice> getById(Long id) {
        return invoiceRepository.findById(id);
    }

    public boolean deleteInvoice(Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
   
    public Optional<Invoice> searchByInvoiceNumber(String number) {
        return invoiceRepository.findByInvoiceNumber(number);
    }

    
    public Optional<Invoice> updateInvoice(Long id, Invoice updated) {
        return invoiceRepository.findById(id).map(existing -> {
            existing.setAmount(updated.getAmount());
            existing.setDueDate(updated.getDueDate());
            existing.setStatus(updated.getStatus());
            existing.setNotes(updated.getNotes());
            return invoiceRepository.save(existing);
        });
    }

    
    
}
