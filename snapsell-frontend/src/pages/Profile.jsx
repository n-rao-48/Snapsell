// Profile.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [activeTab, setActiveTab] = useState("auctions");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [profileRes, auctionsRes, bidsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/profile", config),
          axios.get("http://localhost:8080/api/profile/auctions", config),
          axios.get("http://localhost:8080/api/profile/bids", config)
        ]);

        setProfile(profileRes.data);
        setAuctions(auctionsRes.data || []);
        setBids(bidsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2>Please login to view your profile</h2>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Active Auctions", value: auctions.filter(a => a.status === "ACTIVE").length, icon: "🔥" },
    { label: "Total Bids", value: bids.length, icon: "💰" },
    { label: "Items Sold", value: auctions.filter(a => a.status === "SOLD").length, icon: "✅" },
    { label: "Member Since", value: new Date(profile.createdAt || Date.now()).getFullYear(), icon: "📅" }
  ];

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="header-background"></div>
        <div className="header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.username} />
              ) : (
                <span className="avatar-placeholder-large">
                  {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
              <button className="edit-avatar-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <div className="profile-info">
              <div className="profile-name-section">
                <h1 className="profile-name">
                  {profile.username}
                  {profile.verified && (
                    <svg className="verified-badge" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </h1>
                <p className="profile-rating">⭐ 4.8 Rating · 124 Reviews</p>
              </div>

              <div className="profile-contact">
                <div className="contact-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profile.email}
                </div>
                {profile.phone && (
                  <div className="contact-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {profile.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            className="edit-profile-btn"
            onClick={() => setEditMode(!editMode)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'auctions' ? 'active' : ''}`}
          onClick={() => setActiveTab('auctions')}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          My Auctions ({auctions.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bids' ? 'active' : ''}`}
          onClick={() => setActiveTab('bids')}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          My Bids ({bids.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Watchlist
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'auctions' && (
          <div className="auctions-list">
            {auctions.length > 0 ? (
              auctions.map((auction) => (
                <div key={auction.id} className="auction-item">
                  <img 
                    src={auction.imageUrl || '/placeholder.jpg'} 
                    alt={auction.name}
                    className="auction-thumbnail"
                  />
                  <div className="auction-details">
                    <h3 className="auction-name">{auction.name}</h3>
                    <p className="auction-category">{auction.category}</p>
                    <div className="auction-meta">
                      <span className={`status-badge ${auction.status?.toLowerCase()}`}>
                        {auction.status || 'Active'}
                      </span>
                      <span className="bid-count">
                        {auction.bids?.length || 0} bids
                      </span>
                    </div>
                  </div>
                  <div className="auction-price">
                    <span className="price-label">Current Bid</span>
                    <span className="price-value">
                      {formatCurrency(auction.bids?.length > 0 
                        ? Math.max(...auction.bids.map(b => b.amount))
                        : auction.price)}
                    </span>
                  </div>
                  <div className="auction-actions">
                    <Link to={`/auction/${auction.id}`} className="action-btn view-btn">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    <button className="action-btn edit-btn">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-tab-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3>No auctions yet</h3>
                <p>Start selling items to your community</p>
                <Link to="/create" className="btn-primary">Create Auction</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bids' && (
          <div className="bids-list">
            {bids.length > 0 ? (
              bids.map((bid) => (
                <div key={bid.id} className="bid-item">
                  <img 
                    src={bid.auction?.imageUrl || '/placeholder.jpg'} 
                    alt={bid.auction?.name}
                    className="bid-thumbnail"
                  />
                  <div className="bid-details">
                    <h3 className="bid-auction-name">{bid.auction?.name || 'Unknown Item'}</h3>
                    <div className="bid-info">
                      <span className="your-bid">Your bid: {formatCurrency(bid.amount)}</span>
                      {bid.auction?.bids && (
                        <span className={`bid-status ${
                          Math.max(...bid.auction.bids.map(b => b.amount)) === bid.amount 
                            ? 'winning' 
                            : 'outbid'
                        }`}>
                          {Math.max(...bid.auction.bids.map(b => b.amount)) === bid.amount 
                            ? '🏆 Winning' 
                            : '⚠️ Outbid'}
                        </span>
                      )}
                    </div>
                    <span className="bid-time">
                      Placed {bid.createdAt ? new Date(bid.createdAt).toLocaleDateString() : 'recently'}
                    </span>
                  </div>
                  <div className="bid-actions">
                    <Link to={`/auction/${bid.auction?.id}`} className="action-btn view-btn">
                      View Auction
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-tab-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>No bids placed yet</h3>
                <p>Start bidding on items you like</p>
                <Link to="/auctions" className="btn-primary">Browse Auctions</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="empty-tab-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3>Your watchlist is empty</h3>
            <p>Save items you're interested in to keep track of them</p>
            <Link to="/auctions" className="btn-primary">Browse Auctions</Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* Profile.css */