package com.snapsell.snapsell_backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.Bid;
import com.snapsell.snapsell_backend.models.User;
import com.snapsell.snapsell_backend.security.UserService;
import com.snapsell.snapsell_backend.services.AuctionService;
import com.snapsell.snapsell_backend.services.BidService;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuctionService auctionService;
    @Autowired
    private BidService bidService;

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName(); // username == email in our JWT
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User u = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(u);
    }

    @GetMapping("/auctions")
    public ResponseEntity<List<Auction>> getMyAuctions(Authentication authentication) {
        User u = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(auctionService.getAuctionsByOwnerId(u.getId()));
    }

    @GetMapping("/bids")
    public ResponseEntity<List<Bid>> getMyBids(Authentication authentication) {
        User u = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(bidService.getBidsByUserId(u.getId()));
    }
}
