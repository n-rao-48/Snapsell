package com.snapsell.snapsell_backend.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.snapsell.snapsell_backend.models.Auction;
import com.snapsell.snapsell_backend.models.Invite;
import com.snapsell.snapsell_backend.repositories.AuctionRepository;
import com.snapsell.snapsell_backend.repositories.InviteRepository;

@Service
public class InviteService {

    @Autowired
    private InviteRepository inviteRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    public Invite createInvite(Long auctionId, String invitedEmail) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
        Invite invite = new Invite();
        invite.setAuction(auction);
        invite.setInvitedEmail(invitedEmail);
        invite.setPasscode(UUID.randomUUID().toString().substring(0, 6));
        invite.setExpiryTime(LocalDateTime.now().plusDays(1));
        return inviteRepository.save(invite);
    }

    public boolean verifyInvite(Long auctionId, String passcode) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
        Optional<Invite> op = inviteRepository.findByAuctionAndPasscode(auction, passcode);
        if (op.isEmpty()) return false;
        return op.get().getExpiryTime().isAfter(LocalDateTime.now());
    }
}
