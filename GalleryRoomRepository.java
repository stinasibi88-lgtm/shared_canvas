package com.sharedcanvas.repository;

import com.sharedcanvas.model.GalleryRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GalleryRoomRepository extends JpaRepository<GalleryRoom, Long> {
    Optional<GalleryRoom> findByRoomCode(String roomCode);
}
