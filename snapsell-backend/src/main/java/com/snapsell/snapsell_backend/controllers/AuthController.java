package com.snapsell.snapsell_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snapsell.snapsell_backend.dto.AuthResponse;
import com.snapsell.snapsell_backend.dto.LoginRequest;
import com.snapsell.snapsell_backend.dto.RegisterRequest;
import com.snapsell.snapsell_backend.models.User;
import com.snapsell.snapsell_backend.repositories.UserRepository;
import com.snapsell.snapsell_backend.security.JwtService;
import com.snapsell.snapsell_backend.security.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User u = new User();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setPhone(req.getPhone());
        u.setPassword(req.getPassword());
        User saved = userService.registerUser(u);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        var opt = userRepository.findByEmail(req.getEmail());
        if (opt.isEmpty()) return ResponseEntity.status(401).body("Invalid credentials");
        User db = opt.get();
        if (!userService.validateUser(req.getEmail(), req.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User.withUsername(db.getEmail())
                        .password(db.getPassword()).roles(db.getRole()).build()
        );
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
