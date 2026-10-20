package com.sharedcanvas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "gallery_rooms")
public class GalleryRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 12)
    private String roomCode;

    @Column(nullable = false)
    private String roomName;

    private String theme = "Classic";

    public GalleryRoom() {}

    public GalleryRoom(String roomCode, String roomName, String theme) {
        this.roomCode = roomCode;
        this.roomName = roomName;
        this.theme = theme;
    }

    public Long getId() { return id; }
    public String getRoomCode() { return roomCode; }
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
