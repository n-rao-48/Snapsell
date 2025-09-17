package com.snapsell.snapsell_backend.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snapsell.snapsell_backend.models.User;
import com.snapsell.snapsell_backend.services.UserService;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // Login validation
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        Optional<User> dbUser = userService.findByEmail(user.getEmail());
        if (dbUser.isPresent() && passwordEncoder.matches(user.getPassword(), dbUser.get().getPassword())) {
            return ResponseEntity.ok("Login successful for " + dbUser.get().getEmail());
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
}
