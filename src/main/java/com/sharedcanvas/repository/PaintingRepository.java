package com.sharedcanvas.repository;

import com.sharedcanvas.model.Painting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaintingRepository extends JpaRepository<Painting, Long> {
    List<Painting> findByRoomId(Long roomId);
}
