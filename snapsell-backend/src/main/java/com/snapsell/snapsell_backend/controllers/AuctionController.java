package com.snapsell.snapsell_backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.snapsell.snapsell_backend.services.FileStorageService;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "http://localhost:3000")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private FileStorageService fileStorageService;

    // ✅ Upload image and attach to auction
    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Auction auction = auctionService.getAuctionById(id)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        String fileName = fileStorageService.storeFile(file);

        // Set auction image URL
        String fileUrl = "/uploads/" + fileName; // You can serve this via a static resource mapping
        auction.setImageUrl(fileUrl);

        auctionService.saveAuction(auction);

        return ResponseEntity.ok("File uploaded successfully: " + fileUrl);
    }

    // ✅ Create new auction
    @PostMapping
    public ResponseEntity<Auction> createAuction(@RequestBody Auction auction) {
        Auction saved = auctionService.createAuction(auction);
        return ResponseEntity.ok(saved);
    }

    // ✅ Get all auctions
    @GetMapping
    public ResponseEntity<List<Auction>> getAll() {
        return ResponseEntity.ok(auctionService.getAllAuctions());
    }

    // ✅ Get auction by ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return auctionService.getAuctionById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Auction not found"));
    }

    // ✅ Get all PUBLIC auctions
    @GetMapping("/public")
    public ResponseEntity<List<Auction>> getPublic() {
        return ResponseEntity.ok(auctionService.getAuctionsByType(AuctionType.PUBLIC));
    }

    // ✅ Close auction
    @PutMapping("/{id}/close")
    public ResponseEntity<?> close(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(auctionService.closeAuction(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(400).body(ex.getMessage());
        }
    }
}
