package com.snapsell.snapsell_backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snapsell.snapsell_backend.models.Bid;
import com.snapsell.snapsell_backend.services.BidService;

@RestController
@RequestMapping("/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    // Place a bid
    @PostMapping("/{auctionId}")
    public ResponseEntity<Bid> placeBid(@PathVariable Long auctionId, @RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.placeBid(auctionId, bid));
    }

    // Get bids for an auction
    @GetMapping("/{auctionId}")
    public ResponseEntity<List<Bid>> getBids(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getBidsForAuction(auctionId));
    }
}
