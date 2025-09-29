package com.snapsell.snapsell_backend.services;

import java.time.LocalDateTime;
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
        if (auction.getStartTime() == null) auction.setStartTime(LocalDateTime.now());
        if (auction.getStatus() == null) auction.setStatus("ACTIVE");
        return auctionRepository.save(auction);
    }

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public Optional<Auction> getAuctionById(Long id) {
        return auctionRepository.findById(id);
    }

    public Auction closeAuction(Long id) {
        Auction a = auctionRepository.findById(id).orElseThrow(() -> new RuntimeException("Auction not found"));
        a.setStatus("CLOSED");
        a.setEndTime(LocalDateTime.now());
        return auctionRepository.save(a);
    }

    public List<Auction> getAuctionsByType(AuctionType type) {
        return auctionRepository.findByType(type);
    }

    public List<Auction> getAuctionsByOwnerId(Long ownerId) {
        return auctionRepository.findByOwnerId(ownerId);
    }

    public Auction saveAuction(Auction auction) {
        return auctionRepository.save(auction);
    }
}
