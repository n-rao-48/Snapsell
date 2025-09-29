package com.snapsell.snapsell_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.Bid;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionOrderByAmountDesc(Auction auction);
    List<Bid> findByUserId(Long userId);
}
