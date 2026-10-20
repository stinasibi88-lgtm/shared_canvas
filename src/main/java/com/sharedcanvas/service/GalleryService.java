package com.sharedcanvas.service;

import com.sharedcanvas.model.GalleryRoom;
import com.sharedcanvas.repository.GalleryRoomRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class GalleryService {
    private final GalleryRoomRepository rooms;
    private final Random random = new Random();

    public GalleryService(GalleryRoomRepository rooms) {
        this.rooms = rooms;
    }

    public GalleryRoom create(String name, String theme) {
        String code;
        do {
            code = randomCode();
        } while (rooms.findByRoomCode(code).isPresent());

        return rooms.save(new GalleryRoom(code, name, theme));
    }

    public GalleryRoom findByCode(String code) {
        return rooms.findByRoomCode(code.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
    }

    private String randomCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            out.append(chars.charAt(random.nextInt(chars.length())));
        }
        return out.toString();
    }
}
