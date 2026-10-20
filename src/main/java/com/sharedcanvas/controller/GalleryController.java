package com.sharedcanvas.controller;

import com.sharedcanvas.model.GalleryRoom;
import com.sharedcanvas.model.Painting;
import com.sharedcanvas.service.GalleryService;
import com.sharedcanvas.service.PaintingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class GalleryController {
    private final GalleryService gallery;
    private final PaintingService painting;

    public GalleryController(GalleryService gallery, PaintingService painting) {
        this.gallery = gallery;
        this.painting = painting;
    }

    @PostMapping("/rooms")
    public GalleryRoom createRoom(@RequestBody Map<String, String> body) {
        return gallery.create(
                body.getOrDefault("name", "Our Shared Gallery"),
                body.getOrDefault("theme", "Classic")
        );
    }

    @GetMapping("/rooms/{code}")
    public GalleryRoom getRoom(@PathVariable String code) {
        return gallery.findByCode(code);
    }

    @GetMapping("/rooms/{code}/paintings")
    public List<Painting> getPaintings(@PathVariable String code) {
        GalleryRoom room = gallery.findByCode(code);
        return painting.forRoom(room.getId());
    }
}
