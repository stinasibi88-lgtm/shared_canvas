package com.sharedcanvas.websocket;

public record RoomState(String type, String username, String characterType, double x, double y, String roomCode) {}
