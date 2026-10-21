package com.sharedcanvas.model;

import jakarta.persistence.*;

@Entity
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String country;

    @Column(length = 2000)
    private String biography;

    public Artist() {}

    public Artist(String name, String country, String biography) {
        this.name = name;
        this.country = country;
        this.biography = biography;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }
}
