package com.sharedcanvas.model;

import jakarta.persistence.*;

@Entity
public class Painting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private int year;
    private String medium;

    @Column(length = 3000)
    private String description;

    private String imageUrl;

    @ManyToOne(optional = false)
    private Artist artist;

    @ManyToOne(optional = false)
    private GalleryRoom room;

    public Painting() {}

    public Painting(String title, int year, String medium, String description,
                    String imageUrl, Artist artist, GalleryRoom room) {
        this.title = title;
        this.year = year;
        this.medium = medium;
        this.description = description;
        this.imageUrl = imageUrl;
        this.artist = artist;
        this.room = room;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public int getYear() {
        return year;
    }

    public String getMedium() {
        return medium;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Artist getArtist() {
        return artist;
    }

    public GalleryRoom getRoom() {
        return room;
    }
}