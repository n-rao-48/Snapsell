package com.snapsell.snapsell_backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.snapsell.snapsell_backend.models.User;
import com.snapsell.snapsell_backend.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
    return userRepository.findById(id);
}

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public boolean validateUser(String email, String rawPassword) {
    Optional<User> dbUser = userRepository.findByEmail(email);
    if (dbUser.isPresent()) {
        return passwordEncoder.matches(rawPassword, dbUser.get().getPassword());
    }
    return false;
}

    public User updateUser(Long id, User updatedUser) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));

    user.setUsername(updatedUser.getUsername());
    user.setEmail(updatedUser.getEmail());
    user.setPhone(updatedUser.getPhone());

    return userRepository.save(user);
}

}