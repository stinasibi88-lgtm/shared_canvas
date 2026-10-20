package com.sharedcanvas.websocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GalleryWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final Map<String, String> sessionRooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String room = sessionRooms.remove(session.getId());
        if (room != null) {
            Set<WebSocketSession> members = rooms.get(room);
            if (members != null) {
                members.remove(session);
                broadcast(room, Map.of("type", "LEAVE", "sessionId", session.getId()));
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode data = mapper.readTree(message.getPayload());
        String type = data.path("type").asText();
        String room = data.path("roomCode").asText("").toUpperCase();

        if ("JOIN".equals(type)) {
            sessionRooms.put(session.getId(), room);
            rooms.computeIfAbsent(room, r -> ConcurrentHashMap.newKeySet()).add(session);
            broadcast(room, data);
            return;
        }

        if (room.isBlank()) {
            room = sessionRooms.get(session.getId());
        }

        if (room != null) {
            broadcast(room, data);
        }
    }

    private void broadcast(String room, JsonNode data) throws Exception {
        String payload = mapper.writeValueAsString(data);
        broadcast(room, payload);
    }

    private void broadcast(String room, Map<String, Object> data) {
        try {
            broadcast(room, mapper.writeValueAsString(data));
        } catch (Exception ignored) {}
    }

    private void broadcast(String room, String payload) {
        Set<WebSocketSession> members = rooms.getOrDefault(room, Set.of());
        for (WebSocketSession member : members) {
            if (member.isOpen()) {
                try {
                    member.sendMessage(new TextMessage(payload));
                } catch (Exception ignored) {}
            }
        }
    }
}
