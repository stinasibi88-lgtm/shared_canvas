package com.sharedcanvas.controller;

import com.sharedcanvas.model.User;
import com.sharedcanvas.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> body) {
        return safe(auth.register(
                body.get("username"),
                body.get("password"),
                body.getOrDefault("characterType", "BLUE")
        ));
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> body) {
        return safe(auth.login(body.get("username"), body.get("password")));
    }

    private User safe(User user) {
        user.setPassword("");
        return user;
    }
}
