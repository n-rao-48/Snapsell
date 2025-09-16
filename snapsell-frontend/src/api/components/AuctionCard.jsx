import { Link } from "react-router-dom";
import { formatCurrency } from '../../utils/format';
import "./AuctionCard.css";

function AuctionCard({ auction }) {
  // Function to get the highest bid amount
  const getHighestBid = () => {
    if (auction.bids && auction.bids.length > 0) {
      // Find the bid with the highest amount
      const highestBid = auction.bids.reduce((max, bid) => 
        (max.amount > bid.amount ? max : bid)
      );
      return highestBid.amount;
    }
    return auction.price; // Use starting price if no bids exist
  };

  const currentBid = getHighestBid();

  return (
    <Link
      to={`/auction/${auction.id}`}
      className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={auction.imageUrl}
        alt={auction.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-lg">{auction.name}</h2>
        <p className="text-gray-600">
          Current Bid: {formatCurrency(currentBid)}
        </p>
      </div>
    </Link>
  );
}
export default AuctionCard;