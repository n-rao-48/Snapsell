package com.snapsell.snapsell_backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.Bid;
import com.snapsell.snapsell_backend.repositories.AuctionRepository;
import com.snapsell.snapsell_backend.repositories.BidRepository;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    public Bid placeBid(Long auctionId, Bid bid) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
        if ("CLOSED".equalsIgnoreCase(auction.getStatus())) {
            throw new RuntimeException("Auction closed");
        }
        List<Bid> existing = bidRepository.findByAuctionOrderByAmountDesc(auction);
        if (!existing.isEmpty() && bid.getAmount() <= existing.get(0).getAmount()) {
            throw new RuntimeException("Bid must be higher than current highest bid");
        }
        bid.setAuction(auction);
        bid.setBidTime(LocalDateTime.now());
        return bidRepository.save(bid);
    }

    public List<Bid> getBidsForAuction(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
        return bidRepository.findByAuctionOrderByAmountDesc(auction);
    }

    public List<Bid> getBidsByUserId(Long userId) {
        return bidRepository.findByUserId(userId);
    }
}
