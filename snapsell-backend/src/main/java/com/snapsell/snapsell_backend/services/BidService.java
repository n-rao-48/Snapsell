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
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        // Validate higher than last bid
        List<Bid> existingBids = bidRepository.findByAuctionOrderByAmountDesc(auction);
        if (!existingBids.isEmpty() && bid.getAmount() <= existingBids.get(0).getAmount()) {
            throw new RuntimeException("Bid must be higher than the current highest bid");
        }

        bid.setAuction(auction);
        bid.setBidTime(LocalDateTime.now());
        return bidRepository.save(bid);
    }

    public List<Bid> getBidsForAuction(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        return bidRepository.findByAuctionOrderByAmountDesc(auction);
    }
}
