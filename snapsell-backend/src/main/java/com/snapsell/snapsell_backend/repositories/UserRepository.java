package com.snapsell.snapsell_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snapsell.snapsell_backend.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom queries
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByUsername(String username);
}
