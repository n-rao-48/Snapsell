package com.snapsell.snapsell_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.AuctionType;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {

    List<Auction> findByType(AuctionType type);

    List<Auction> findByStatus(String status);
}
