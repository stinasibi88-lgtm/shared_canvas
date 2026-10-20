package com.sharedcanvas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "painting_id"}))
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @ManyToOne(optional = false)
    private Painting painting;

    public Favorite() {}
    public Favorite(User user, Painting painting) {
        this.user = user;
        this.painting = painting;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Painting getPainting() { return painting; }
}
