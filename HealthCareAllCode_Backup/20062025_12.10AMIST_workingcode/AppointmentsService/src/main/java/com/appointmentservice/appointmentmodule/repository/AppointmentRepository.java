/*package com.appointmentservice.appointmentmodule.repository;

//package com.wellnesswave.healthcare.repository;

import com.appointmentservice.appointmentmodule.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(String patientId);
}
*/

/*package com.appointmentservice.appointmentmodule.repository;

import com.appointmentservice.appointmentmodule.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorId(String doctorId);
    Optional<Appointment> findByPatientId(Long patientId);
}
*/


package com.appointmentservice.appointmentmodule.repository;

import com.appointmentservice.appointmentmodule.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorId(String doctorId);
}