package com.snapsell.snapsell_backend.models;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "auctions")
@Data
public class Auction {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private long id;
private String name;
private String category;
private int price;
private String imageUrl; // URL to the auction photo

public Auction(long id, String name, String category, int price, String imageUrl) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.imageUrl = imageUrl;
}

@Enumerated(EnumType.STRING)
private AuctionType type;  // PUBLIC or PRIVATE

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status; // ACTIVE or CLOSED

    // Relationships
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bid> bids;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Invite> invites;
}
