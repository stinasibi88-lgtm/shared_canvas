package com.sharedcanvas.repository;

import com.sharedcanvas.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserIdAndPaintingId(Long userId, Long paintingId);
    List<Favorite> findByUserId(Long userId);
}
