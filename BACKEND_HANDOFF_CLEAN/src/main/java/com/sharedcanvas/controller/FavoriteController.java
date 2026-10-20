package com.sharedcanvas.controller;

import com.sharedcanvas.model.Painting;
import com.sharedcanvas.service.PaintingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {
    private final PaintingService service;

    public FavoriteController(PaintingService service) {
        this.service = service;
    }

    @PostMapping("/toggle")
    public Map<String, Boolean> toggle(@RequestBody Map<String, Long> body) {
        service.toggleFavorite(body.get("userId"), body.get("paintingId"));
        return Map.of("success", true);
    }

    @GetMapping("/{userId}")
    public List<Painting> favorites(@PathVariable Long userId) {
        return service.favoritesFor(userId);
    }
}
