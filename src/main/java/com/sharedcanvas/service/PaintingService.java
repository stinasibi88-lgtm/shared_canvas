package com.sharedcanvas.service;

import com.sharedcanvas.model.Favorite;
import com.sharedcanvas.model.Painting;
import com.sharedcanvas.model.User;
import com.sharedcanvas.repository.FavoriteRepository;
import com.sharedcanvas.repository.PaintingRepository;
import com.sharedcanvas.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaintingService {
    private final PaintingRepository paintings;
    private final FavoriteRepository favorites;
    private final UserRepository users;

    public PaintingService(PaintingRepository paintings, FavoriteRepository favorites, UserRepository users) {
        this.paintings = paintings;
        this.favorites = favorites;
        this.users = users;
    }

    public List<Painting> forRoom(Long roomId) {
        return paintings.findByRoomId(roomId);
    }

    public List<Painting> favoritesFor(Long userId) {
        return favorites.findByUserId(userId).stream().map(Favorite::getPainting).toList();
    }

    public void toggleFavorite(Long userId, Long paintingId) {
        var existing = favorites.findByUserIdAndPaintingId(userId, paintingId);
        if (existing.isPresent()) {
            favorites.delete(existing.get());
            return;
        }
        User user = users.findById(userId).orElseThrow();
        Painting painting = paintings.findById(paintingId).orElseThrow();
        favorites.save(new Favorite(user, painting));
    }
}
