package com.medicalrecordsservice.mrs.repository;

import com.medicalrecordsservice.mrs.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientId(Long patientId);

    List<MedicalRecord> findByDoctorId(Long doctorId);
    List<MedicalRecord> findByPatientIdIn(List<Long> patientIds);

    List<MedicalRecord> findByRecordDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT r FROM MedicalRecord r " +
           "WHERE (:diagnosis IS NULL OR r.diagnosis LIKE %:diagnosis%) " +
           "AND (:patientId IS NULL OR r.patientId = :patientId)")
    List<MedicalRecord> search(@Param("diagnosis") String diagnosis, @Param("patientId") Long patientId);
}
