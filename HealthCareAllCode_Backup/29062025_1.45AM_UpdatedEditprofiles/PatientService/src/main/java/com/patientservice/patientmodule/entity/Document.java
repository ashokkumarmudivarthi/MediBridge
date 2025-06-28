/*package com.patientservice.patientmodule.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    private Long patientId;
    private Long visitId;

    private String fileName;
    private String fileType;
    private String uploadedBy;

    private LocalDateTime uploadDate;
    
   // @Lob
    //@Column(name = "data")
    //private byte[] data;
    
    @Lob
    @Column(name = "data", columnDefinition = "bytea")
    private byte[] data;

    @Column(columnDefinition = "TEXT")
    private String filePath;

    @PrePersist
    public void onCreate() {
        this.uploadDate = LocalDateTime.now();
    }
}
*/



package com.patientservice.patientmodule.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonSubTypes.Type;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    private Long patientId;
    private Long visitId;

    private String fileName;
    private String fileType;
    private String uploadedBy;

    private LocalDateTime uploadDate;

   /* @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data", columnDefinition = "bytea")
    private byte[] data;*/
    
  /*  @Lob
    @Type(type = "org.hibernate.type.BinaryType") // 👈 forces Hibernate to treat it as byte[]
    @Column(name = "data")
    private byte[] data;
*/

    
    
    @Column(columnDefinition = "TEXT")
    private String filePath;

    @PrePersist
    public void onCreate() {
        this.uploadDate = LocalDateTime.now();
    }

    // ====== Getters and Setters ======

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getVisitId() {
        return visitId;
    }

    public void setVisitId(Long visitId) {
        this.visitId = visitId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
/*
    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }*/

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    // ====== toString (excluding raw byte data) ======
    @Override
    public String toString() {
        return "Document{" +
                "documentId=" + documentId +
                ", patientId=" + patientId +
                ", visitId=" + visitId +
                ", fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", uploadedBy='" + uploadedBy + '\'' +
                ", uploadDate=" + uploadDate +
                ", filePath='" + filePath + '\'' +
                '}';
    }

	
}
