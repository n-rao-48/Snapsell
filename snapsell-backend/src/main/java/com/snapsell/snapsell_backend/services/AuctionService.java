package com.snapsell.snapsell_backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.AuctionType;
import com.snapsell.snapsell_backend.repositories.AuctionRepository;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    public Auction createAuction(Auction auction) {
        auction.setStatus("ACTIVE");
        return auctionRepository.save(auction);
    }

    public List<Auction> getAllAuctions() {
        List<Auction> auctions = new ArrayList<>();

        auctions.add(new Auction(1, "iPhone 15 Pro Max", "Electronics", 95000, "https://via.placeholder.com/250"));
        auctions.add(new Auction(2, "MacBook Air M2", "Electronics", 120000, "https://via.placeholder.com/250"));

        return auctions;
    }

    public List<Auction> getAuctionsByType(AuctionType type) {
        return auctionRepository.findByType(type);
    }

    public Optional<Auction> getAuctionById(Long id) {
        return auctionRepository.findById(id);
    }

    public Auction closeAuction(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        auction.setStatus("CLOSED");
        return auctionRepository.save(auction);
    }
}
