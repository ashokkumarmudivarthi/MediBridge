package com.patientservice.patientmodule.service;



import com.patientservice.patientmodule.entity.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    Document uploadFile(MultipartFile file, Long patientId, Long visitId, String uploadedBy);
    List<Document> getDocumentsByPatient(Long patientId);
    List<Document> getDocumentsByVisit(Long visitId);
    
    Document getDocument(Long id);
    //Document getDocumentById(Long documentId);  // 🔍 Needed for download
}
