package com.snapsell.snapsell_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.snapsell.snapsell_backend.models.Invite;
import com.snapsell.snapsell_backend.services.InviteService;

@RestController
@RequestMapping("/invites")
public class InviteController {

    @Autowired
    private InviteService inviteService;

    // Create invite
    @PostMapping("/{auctionId}")
    public ResponseEntity<Invite> createInvite(@PathVariable Long auctionId, @RequestParam String email) {
        return ResponseEntity.ok(inviteService.createInvite(auctionId, email));
    }

    // Verify invite
    @PostMapping("/{auctionId}/verify")
    public ResponseEntity<String> verifyInvite(@PathVariable Long auctionId, @RequestParam String passcode) {
        boolean valid = inviteService.verifyInvite(auctionId, passcode);
        if (valid) {
            return ResponseEntity.ok("Invite verified! Access granted.");
        } else {
            return ResponseEntity.status(401).body("Invalid or expired invite.");
        }
    }
}
