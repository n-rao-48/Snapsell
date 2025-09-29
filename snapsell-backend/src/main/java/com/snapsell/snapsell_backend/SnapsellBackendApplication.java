package com.snapsell.snapsell_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.snapsell.snapsell_backend.config.FileStorageProperties;
import com.snapsell.snapsell_backend.config.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, FileStorageProperties.class})
public class SnapsellBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SnapsellBackendApplication.class, args);
    }
}