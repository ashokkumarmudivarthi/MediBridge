/*
 * Working code fully 
 * 
 * package com.doctorservice.dm.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   // @Column(name = "id") //working code going to add additional one so disabled here
    private Long id;

    
    @NotNull @JsonProperty("doctor_name")
    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    
    
    

    @JsonProperty("specialist_in")
    @Column(name = "specialist_in")
    private String specialistIn;

    @JsonProperty("specialization")
    @Column(name = "specialization")
    private String specialization;

    @JsonProperty("qualifications")
    @Column(name = "qualifications")
    private String qualifications;

    @JsonProperty("experience_years")
    @Column(name = "experience_years")
    private Integer experienceYears;

    @JsonProperty("phone_number")
    @Column(name = "phone_number")
    private String phoneNumber;

    @JsonProperty("contact_number")
    @Column(name = "contact_number")
    private String contactNumber;

    @JsonProperty("email")
    @Column(name = "email")
    private String email;

    @JsonProperty("gender")
    @Column(name = "gender")
    private String gender;

    @JsonProperty("state")
    @Column(name = "state")
    private String state;

    @JsonProperty("hospital_name")
    @Column(name = "hospital_name")
    private String hospitalName;

    @JsonProperty("availability")
    @Column(name = "availability")
    private String availability;

    @JsonProperty("status")
    @Column(name = "status")
    private String status;
    
    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;
    
    @JsonProperty("country")
    @Column(name = "country")
    private String country;

    @JsonProperty("city")
    @Column(name = "city")
    private String city;
    
    
    // NEW: link to Users
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Users user;
    
    
    

    // No-args constructor required by JPA
    public Doctor() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getSpecialistIn() {
        return specialistIn;
    }

    public void setSpecialistIn(String specialistIn) {
        this.specialistIn = specialistIn;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    // New getters and setters for username and password

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
    
    public Users getUser() {
        return user;
    }
    public void setUser(Users user) {
        this.user = user;
    }

    
    

    // Optional for debugging
    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", doctorName='" + doctorName + '\'' +
                ", specialistIn='" + specialistIn + '\'' +
                ", specialization='" + specialization + '\'' +
                ", qualifications='" + qualifications + '\'' +
                ", experienceYears=" + experienceYears +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", email='" + email + '\'' +
                ", gender='" + gender + '\'' +
                ", country='" + country + '\'' +
                ", state='" + state + '\'' +
                ", city='" + city + '\'' +
                ", hospitalName='" + hospitalName + '\'' +
                ", availability='" + availability + '\'' +
                ", status='" + status + '\'' +
                ",user=" + (user != null ? user.getId() : null) +
                '}';
    }

}
*/


package com.doctorservice.dm.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull @JsonProperty("doctor_name")
    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @JsonProperty("specialist_in")
    @Column(name = "specialist_in")
    private String specialistIn;

    @JsonProperty("specialization")
    @Column(name = "specialization")
    private String specialization;

    @JsonProperty("qualifications")
    @Column(name = "qualifications")
    private String qualifications;

    @JsonProperty("experience_years")
    @Column(name = "experience_years")
    private Integer experienceYears;

    @JsonProperty("phone_number")
    @Column(name = "phone_number")
    private String phoneNumber;

    @JsonProperty("contact_number")
    @Column(name = "contact_number")
    private String contactNumber;

    @JsonProperty("email")
    @Column(name = "email")
    private String email;

    @JsonProperty("gender")
    @Column(name = "gender")
    private String gender;

    @JsonProperty("state")
    @Column(name = "state")
    private String state;

    @JsonProperty("hospital_name")
    @Column(name = "hospital_name")
    private String hospitalName;

    @JsonProperty("availability")
    @Column(name = "availability")
    private String availability;

    @JsonProperty("status")
    @Column(name = "status")
    private String status;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @JsonProperty("country")
    @Column(name = "country")
    private String country;

    @JsonProperty("city")
    @Column(name = "city")
    private String city;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Users user;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // No-args constructor
    public Doctor() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getSpecialistIn() { return specialistIn; }
    public void setSpecialistIn(String specialistIn) { this.specialistIn = specialistIn; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", doctorName='" + doctorName + '\'' +
                ", specialistIn='" + specialistIn + '\'' +
                ", specialization='" + specialization + '\'' +
                ", qualifications='" + qualifications + '\'' +
                ", experienceYears=" + experienceYears +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", email='" + email + '\'' +
                ", gender='" + gender + '\'' +
                ", country='" + country + '\'' +
                ", state='" + state + '\'' +
                ", city='" + city + '\'' +
                ", hospitalName='" + hospitalName + '\'' +
                ", availability='" + availability + '\'' +
                ", status='" + status + '\'' +
                ", user=" + (user != null ? user.getId() : null) +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}


