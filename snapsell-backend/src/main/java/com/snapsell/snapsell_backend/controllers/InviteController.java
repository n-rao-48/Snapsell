package com.snapsell.snapsell_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.snapsell.snapsell_backend.models.Invite;
import com.snapsell.snapsell_backend.services.InviteService;

@RestController
@RequestMapping("/invites")
@CrossOrigin(origins = "http://localhost:3000")
public class InviteController {

    @Autowired
    private InviteService inviteService;

    @PostMapping("/{auctionId}")
    public ResponseEntity<?> createInvite(@PathVariable Long auctionId, @RequestParam String email) {
        Invite invite = inviteService.createInvite(auctionId, email);
        return ResponseEntity.ok(invite);
    }

    @PostMapping("/{auctionId}/verify")
    public ResponseEntity<?> verifyInvite(@PathVariable Long auctionId, @RequestParam String passcode) {
        boolean ok = inviteService.verifyInvite(auctionId, passcode);
        if (ok) return ResponseEntity.ok("Invite valid");
        return ResponseEntity.status(401).body("Invalid or expired invite");
    }
}
