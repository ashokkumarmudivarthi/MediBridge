/*package com.billing.invoice.controller;

import com.billing.invoice.dto.InvoiceRequest;
import com.billing.invoice.entity.Invoice;
import com.billing.invoice.service.InvoiceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody InvoiceRequest request) {
        Invoice created = invoiceService.createInvoice(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getAll() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getById(@PathVariable Long id) {
        return invoiceService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Invoice>> getByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(invoiceService.getByPatientId(patientId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}

*/


package com.billing.invoice.controller;

import com.billing.invoice.dto.InvoiceRequest;
import com.billing.invoice.entity.Invoice;
import com.billing.invoice.service.InvoiceService;
import com.billing.invoice.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@RequestBody InvoiceRequest request) {
        return invoiceService.createInvoice(request)
                .map(invoice -> ResponseEntity.ok(new ApiResponse<>(true, "Invoice created successfully", invoice)))
                .orElseGet(() -> ResponseEntity.badRequest().body(new ApiResponse<>(false, "Invalid invoice request", null)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<Invoice>>> getAll() {
        List<Invoice> invoices = invoiceService.getAllInvoices();
        String msg = invoices.isEmpty() ? "No invoices found." : "Invoices retrieved successfully";
        return ResponseEntity.ok(new ApiResponse<>(true, msg, invoices));
    }
    
 // ✅ First - more specific mapping
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Invoice>> searchByInvoiceNumber(@RequestParam String number) {
    	Optional<Invoice> invoiceOpt = invoiceService.searchByInvoiceNumber(number);

        if (invoiceOpt.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Invoice found", invoiceOpt.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse<>(false, "Invoice not found", null));
        }
    }
    
    

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<Invoice>> getById(@PathVariable Long id) {
        return invoiceService.getById(id)
                .map(invoice -> ResponseEntity.ok(new ApiResponse<>(true, "Invoice found", invoice)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Invoice not found", null)));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<Invoice>>> getByPatientId(@PathVariable Long patientId) {
        List<Invoice> records = invoiceService.getByPatientId(patientId);
        String msg = records.isEmpty() ? "No invoices for the patient." : "Patient invoices retrieved successfully";
        return ResponseEntity.ok(new ApiResponse<>(true, msg, records));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        boolean deleted = invoiceService.deleteInvoice(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Invoice deleted successfully", "Deleted ID: " + id));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Invoice not found with ID: " + id, null));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Invoice>> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoice) {
        return invoiceService.updateInvoice(id, invoice)
            .map(updated -> ResponseEntity.ok(new ApiResponse<>(true, "Invoice updated", updated)))
            .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Invoice not found", null)));
    }

    
}

