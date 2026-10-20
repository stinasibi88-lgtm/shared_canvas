
package com.sharedcanvas.service;

import com.sharedcanvas.model.User;
import com.sharedcanvas.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository users;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthService(UserRepository users) {
        this.users = users;
    }

    public User register(
            String username,
            String password,
            String characterType) {

        if (username == null || username.isBlank()
                || password == null || password.isBlank()) {
            throw new IllegalArgumentException(
                    "Username and password are required");
        }

        if (users.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException(
                    "Username already exists");
        }

        String hashedPassword = passwordEncoder.encode(password);

        User user = new User(
                username,
                hashedPassword,
                characterType
        );

        return users.save(user);
    }

    public User login(String username, String password) {
        if (username == null || username.isBlank()
                || password == null || password.isBlank()) {
            throw new IllegalArgumentException(
                    "Username and password are required");
        }

        User user = users.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid username or password"));

        String storedPassword = user.getPassword();

        if (storedPassword == null) {
            throw new IllegalArgumentException(
                    "Invalid username or password");
        }

        // Verify passwords that were already stored using BCrypt.
        if (storedPassword.startsWith("$2")) {
            if (!passwordEncoder.matches(password, storedPassword)) {
                throw new IllegalArgumentException(
                        "Invalid username or password");
            }
        } else {
            // Upgrade a legacy plain-text password after successful login.
            if (!storedPassword.equals(password)) {
                throw new IllegalArgumentException(
                        "Invalid username or password");
            }

            user.setPassword(passwordEncoder.encode(password));
            users.save(user);
        }

        return user;
    }
}
