import { Link } from "react-router-dom";
import { formatCurrency } from '../../utils/format';
import "./AuctionCard.css";

function AuctionCard({ auction }) {
  const getHighestBid = () => {
    if (auction.bids && auction.bids.length > 0) {
      const highestBid = auction.bids.reduce((max, bid) =>
        (max.amount > bid.amount ? max : bid)
      );
      return highestBid.amount;
    }
    return auction.price;
  };

  const getBidCount = () => {
    return auction.bids ? auction.bids.length : 0;
  };

  const getTimeRemaining = () => {
    if (!auction.endTime) return null;
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;
    
    if (diff <= 0) return "Ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return "Ending soon";
  };

  const isEndingSoon = () => {
    if (!auction.endTime) return false;
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;
    return diff <= 24 * 60 * 60 * 1000; // Less than 24 hours
  };

  const isNew = () => {
    if (!auction.startTime) return false;
    const now = new Date();
    const start = new Date(auction.startTime);
    const diff = now - start;
    return diff <= 24 * 60 * 60 * 1000; // Less than 24 hours old
  };

  const currentBid = getHighestBid();
  const bidCount = getBidCount();
  const timeRemaining = getTimeRemaining();

  return (
    <Link to={`/auction/${auction.id}`} className="auction-card">
      <div className="card-image-container">
        <img
          src={auction.imageUrl || '/placeholder-image.jpg'}
          alt={auction.name}
          className="card-image"
          loading="lazy"
        />
        
        {/* Status Badges */}
        <div className="card-badges">
          {isNew() && <span className="badge badge-new">New</span>}
          {isEndingSoon() && <span className="badge badge-urgent">Ending Soon</span>}
          {auction.category && (
            <span className="badge badge-category">{auction.category}</span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="favorite-btn" onClick={(e) => {
          e.preventDefault();
          // Add to favorites logic
        }}>
          <svg className="heart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Time Remaining Overlay */}
        {timeRemaining && (
          <div className={`time-remaining ${isEndingSoon() ? 'urgent' : ''}`}>
            <svg className="clock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            {timeRemaining}
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{auction.name}</h3>
          {auction.condition && (
            <span className={`condition-badge ${auction.condition.toLowerCase()}`}>
              {auction.condition}
            </span>
          )}
        </div>

        {auction.description && (
          <p className="card-description">
            {auction.description.length > 80 
              ? `${auction.description.substring(0, 80)}...` 
              : auction.description}
          </p>
        )}

        <div className="card-pricing">
          <div className="price-info">
            <span className="current-bid">{formatCurrency(currentBid)}</span>
            {auction.price !== currentBid && (
              <span className="starting-price">
                Started at {formatCurrency(auction.price)}
              </span>
            )}
          </div>
          
          <div className="bid-info">
            {bidCount > 0 ? (
              <span className="bid-count">
                <svg className="bid-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                {bidCount} {bidCount === 1 ? 'bid' : 'bids'}
              </span>
            ) : (
              <span className="no-bids">No bids yet</span>
            )}
          </div>
        </div>

        {/* Seller Info */}
        {auction.owner && (
          <div className="seller-info">
            <div className="seller-avatar">
              {auction.owner.profilePicture ? (
                <img src={auction.owner.profilePicture} alt={auction.owner.username} />
              ) : (
                <div className="avatar-placeholder">
                  {auction.owner.username ? auction.owner.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="seller-details">
              <span className="seller-name">
                {auction.owner.username || 'Anonymous'}
              </span>
              {auction.owner.verified && (
                <svg className="verified-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover Actions */}
      <div className="card-actions">
        <button className="quick-bid-btn">
          Quick Bid
        </button>
        <button className="watch-btn">
          Watch
        </button>
      </div>
    </Link>
  );
}

export default AuctionCard;