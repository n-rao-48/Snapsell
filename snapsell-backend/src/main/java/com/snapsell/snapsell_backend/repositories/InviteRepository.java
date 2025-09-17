package com.snapsell.snapsell_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.Invite;

@Repository
public interface InviteRepository extends JpaRepository<Invite, Long> {

    Optional<Invite> findByAuctionAndPasscode(Auction auction, String passcode);
}
