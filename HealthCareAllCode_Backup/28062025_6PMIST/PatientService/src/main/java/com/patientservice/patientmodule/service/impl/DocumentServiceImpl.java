package com.patientservice.patientmodule.service.impl;

import com.patientservice.patientmodule.entity.Document;
import com.patientservice.patientmodule.repository.DocumentRepository;
import com.patientservice.patientmodule.service.DocumentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class DocumentServiceImpl implements DocumentService {
	
	 @Autowired
	    private JdbcTemplate jdbcTemplate;

    private final DocumentRepository documentRepository;

    @Value("${document.upload.dir:uploads}") // Optional default value
    private String uploadDir;

    public DocumentServiceImpl(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

   
  /*  @Override
    public Document uploadFile(MultipartFile file, Long patientId, Long visitId, String uploadedBy) {
        try {
            System.out.println("==== [UPLOAD DEBUG START] ====");
            System.out.println("Received file name: " + file.getOriginalFilename());
            System.out.println("File content type: " + file.getContentType());
            System.out.println("Uploaded by: " + uploadedBy);
            System.out.println("Patient ID: " + patientId);
            System.out.println("Visit ID: " + visitId);
            System.out.println("File size (bytes): " + file.getSize());
            
           

            byte[] fileBytes = file.getBytes();
            System.out.println("file.getBytes() length: " + fileBytes.length);

            Document doc = new Document();
            doc.setFileName(file.getOriginalFilename());
            doc.setFileType(file.getContentType());
            doc.setUploadedBy(uploadedBy);
            doc.setPatientId(patientId);
            doc.setVisitId(visitId);
          //  doc.setData(fileBytes); // ✅ Store file in DB
            doc.setFilePath("N/A"); // Not used now

            System.out.println("Attempting to save document to DB...");

            Document savedDoc = documentRepository.save(doc);

            System.out.println("Document saved successfully with ID: " + savedDoc.getDocumentId());
            System.out.println("==== [UPLOAD DEBUG END] ====");

            return savedDoc;
        } catch (IOException e) {
            System.err.println("IOException while reading file bytes: " + e.getMessage());
            throw new RuntimeException("Failed to store file", e);
        } catch (Exception ex) {
            System.err.println("Unexpected exception: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Upload failed", ex);
        }
    }

    */
    
    
    @Override
    public Document uploadFile(MultipartFile file, Long patientId, Long visitId, String uploadedBy) {
        try {
            byte[] fileBytes = file.getBytes();
            String fileName = file.getOriginalFilename();
            String fileType = file.getContentType();

            // Insert directly into DB using JDBC
            jdbcTemplate.update(
                    "INSERT INTO documents (data, file_name, file_type, file_path, patient_id, uploaded_by, visit_id, upload_date) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, now())",
                    fileBytes, fileName, fileType, "N/A", patientId, uploadedBy, visitId
            );

            // You can return a dummy Document or fetch the latest inserted one if needed
            Document doc = new Document();
            doc.setFileName(fileName);
            doc.setFileType(fileType);
            doc.setUploadedBy(uploadedBy);
            doc.setPatientId(patientId);
            doc.setVisitId(visitId);
            doc.setFilePath("N/A");
            doc.setUploadDate(LocalDateTime.now());
            // Don't set data here to avoid issues again

            System.out.println("✅ Upload successful via JDBC");

            return doc;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload failed", e);
        }
    }

    
    
    
    
    
    
    
    
    

    @Override
    public List<Document> getDocumentsByPatient(Long patientId) {
        return documentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Document> getDocumentsByVisit(Long visitId) {
        return documentRepository.findByVisitId(visitId);
    }

    @Override
    public Document getDocument(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id " + documentId));
    }
}
