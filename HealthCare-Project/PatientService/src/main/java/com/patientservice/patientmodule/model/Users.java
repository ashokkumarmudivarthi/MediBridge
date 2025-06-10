package com.patientservice.patientmodule.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class Users {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // or AUTO if DB supports sequences
	private Long id;
 /*   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;*/

    private String username; // From patient.name
    private String password; // Encrypted patient.contact

    @Column(name = "full_name")
    private String fullName; // From patient.name

    private String email; // From patient.email

    @Column(name = "role_id")
    //private String roleId; // Example: ROLE_PATIENT
    private Long roleId;

    public Users() {}

    public Users(String username, String password, String fullName, String email, Long roleId) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.roleId = roleId;
    }

    // Getters and setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public Long getRoleId() { return roleId; }

    public void setRoleId(long l) { this.roleId = l; }
}
