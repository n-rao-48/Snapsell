package com.snapsell.snapsell_backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.snapsell.snapsell_backend.models.Bid;
import com.snapsell.snapsell_backend.services.BidService;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping("/bids/{auctionId}")
    public ResponseEntity<?> placeBid(@PathVariable Long auctionId, @RequestBody Bid bid) {
        try {
            Bid saved = bidService.placeBid(auctionId, bid);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(400).body(ex.getMessage());
        }
    }

    @MessageMapping("/bid/{auctionId}")
    @SendTo("/topic/bids/{auctionId}")
    public Bid handleBid(@DestinationVariable Long auctionId, Bid bid) {
        // This just echoes the bid message to topic; actual saving via REST endpoint
        return bid;
    }

    @GetMapping("/bids/{auctionId}")
    public ResponseEntity<List<Bid>> getBids(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getBidsForAuction(auctionId));
    }
}
