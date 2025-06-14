package com.medibridge.authservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "roles")  // use plural, as in your database
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

 // Remove this method entirely to allow Lombok @Data to generate it correctly,
 // or implement like below:

 public String getName() {
     return this.name;
 }
}

