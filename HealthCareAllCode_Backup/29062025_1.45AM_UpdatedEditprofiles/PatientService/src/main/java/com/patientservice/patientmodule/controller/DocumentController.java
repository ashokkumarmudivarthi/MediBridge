/*
 
 package com.patientservice.patientmodule.controller;

import com.patientservice.patientmodule.entity.Document;
import com.patientservice.patientmodule.service.DocumentService;

import jakarta.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    @PostMapping("/upload")
    public ResponseEntity<Document> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") Long patientId,
            @RequestParam(value = "visitId", required = false) Long visitId,
            @RequestParam("uploadedBy") String uploadedBy
    ) {
        Document doc = documentService.uploadFile(file, patientId, visitId, uploadedBy);
        return ResponseEntity.ok(doc);
    }

    @GetMapping("/by-patient/{patientId}")
    public ResponseEntity<List<Document>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(documentService.getDocumentsByPatient(patientId));
    }

    @GetMapping("/by-visit/{visitId}")
    public ResponseEntity<List<Document>> getByVisit(@PathVariable Long visitId) {
        return ResponseEntity.ok(documentService.getDocumentsByVisit(visitId));
    }
    
    



    
}

 
 
 
 */


package com.patientservice.patientmodule.controller;

import com.patientservice.patientmodule.entity.Document;
import com.patientservice.patientmodule.service.DocumentService;

import jakarta.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

    @Autowired
    private DocumentService documentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    @PostMapping("/upload")
    public ResponseEntity<Document> upload(
    		
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") Long patientId,
            @RequestParam(value = "visitId", required = false) Long visitId,
            @RequestParam("uploadedBy") String uploadedBy
    ) {
        Document doc = documentService.uploadFile(file, patientId, visitId, uploadedBy);
        System.out.println("File size: " + file.getSize());

        return ResponseEntity.ok(doc);
    }
    
   /* @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        Document doc = documentService.getDocumentByid(id);
        if (doc == null || doc.getData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + doc.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(doc.getFileType()))
                .body(doc.getData());
    }
*/
    
    

    @GetMapping("/by-patient/{patientId}")
    public ResponseEntity<List<Document>> getByPatient(@PathVariable Long patientId) {
    	   System.out.println("🔁 Fetching documents for patientId: " + patientId);
        return ResponseEntity.ok(documentService.getDocumentsByPatient(patientId));
    }

    @GetMapping("/by-visit/{visitId}")
    public ResponseEntity<List<Document>> getByVisit(@PathVariable Long visitId) {
        return ResponseEntity.ok(documentService.getDocumentsByVisit(visitId));
    }
    

    
    @GetMapping("/download/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) {
        String sql = "SELECT data, file_name, file_type FROM documents WHERE document_id = ?";
        
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, documentId);

        byte[] data = (byte[]) result.get("data");
        String fileName = (String) result.get("file_name");
        String fileType = (String) result.get("file_type");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(fileType));
        headers.setContentDisposition(ContentDisposition
                .inline() // Use `.attachment()` to force download
                .filename(fileName)
                .build());

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    
    @GetMapping("/preview/{documentId}")
    public ResponseEntity<byte[]> previewDocument(@PathVariable Long documentId) {
        String sql = "SELECT data, file_name, file_type FROM documents WHERE document_id = ?";
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, documentId);

        byte[] data = (byte[]) result.get("data");
        String fileName = (String) result.get("file_name");
        String fileType = (String) result.get("file_type");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(fileType));
        headers.setContentDisposition(ContentDisposition
                .inline() // ✅ this makes it preview instead of download
                .filename(fileName)
                .build());

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }


    
}
