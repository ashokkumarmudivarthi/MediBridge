/*package com.referencedataservice.RDSModule.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "illnesses")
public class Illness {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
*/

package com.referencedataservice.RDSModule.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "illnesses")
public class Illness {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // Constructors
    public Illness() {
    }

    public Illness(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Illness(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

