package com.snapsell.snapsell_backend.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.AuctionType;
import com.snapsell.snapsell_backend.services.AuctionService;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;


    @PostMapping("/create")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/";
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String filePath = uploadDir + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            // Return the URL of the uploaded image
            String fileUrl = "http://localhost:8080/uploads/" + file.getOriginalFilename();
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
    // Create an auction
    @PostMapping
    public ResponseEntity<Auction> createAuction(@RequestBody Auction auction) {
        return ResponseEntity.ok(auctionService.createAuction(auction));
    }
    // Get all auctions
    @GetMapping
    public ResponseEntity<List<Auction>> getAllAuctions() {
        return ResponseEntity.ok(auctionService.getAllAuctions());
    }
    // Get auction by ID
    @GetMapping("/{id}")
    public ResponseEntity<Auction> getAuctionById(@PathVariable Long id) {
        return auctionService.getAuctionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    // Get only public auctions
    @GetMapping("/public")
    public ResponseEntity<List<Auction>> getPublicAuctions() {
        return ResponseEntity.ok(auctionService.getAuctionsByType(AuctionType.PUBLIC));
    }

    // Close auction by ID
    @PutMapping("/{id}/close")
    public ResponseEntity<Auction> closeAuction(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.closeAuction(id));
    }
}
