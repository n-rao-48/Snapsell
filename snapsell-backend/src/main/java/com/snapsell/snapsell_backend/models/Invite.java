package com.snapsell.snapsell_backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "invites")
@Data
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invitedEmail;
    private String passcode;
    private LocalDateTime expiryTime;

    @ManyToOne
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;
}
