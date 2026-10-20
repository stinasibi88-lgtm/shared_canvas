package com.sharedcanvas.repository;

import com.sharedcanvas.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, Long> {}
