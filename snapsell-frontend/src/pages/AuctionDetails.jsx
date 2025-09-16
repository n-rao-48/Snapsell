import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import "./AuctionDetails.css";

function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const fetchAuctionDetails = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch auction details from the backend
      const auctionResponse = await fetch(`http://localhost:8080/api/auctions/${id}`);
      if (!auctionResponse.ok) {
        throw new Error("Auction not found.");
      }
      const auctionData = await auctionResponse.json();
      setAuction(auctionData);

      // Fetch bids for the auction from the backend
      const bidsResponse = await fetch(`http://localhost:8080/bids/${id}`);
      const bidsData = await bidsResponse.json();
      setBids(bidsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, setError, setAuction, setBids]);

  const getHighestBid = () => {
    if (bids && bids.length > 0) {
      // Find the bid with the highest amount
      const highestBid = bids.reduce((max, bid) => 
        (max.amount > bid.amount ? max : bid)
      );
      return highestBid.amount;
    }
    return auction.price; // Use starting price if no bids exist
  };
  
  useEffect(() => {
    fetchAuctionDetails();
  }, [id, fetchAuctionDetails]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || isNaN(bidAmount)) {
      alert("Please enter a valid bid amount.");
      return;
    }

    const newBid = {
      amount: parseFloat(bidAmount),
      // In a real app, you would get the user ID from a logged-in state
      user: { id: 1 } // Mock user for now
    };

    try {
      const response = await fetch(`http://localhost:8080/bids/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBid)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to place bid.");
      }

      // Re-fetch auction and bids to update the UI
      fetchAuctionDetails();
      setBidAmount('');
      alert("Bid placed successfully!");

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!auction) return <p className="p-6">Auction not found.</p>;

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-600 underline">
        ← Back
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <img
          src={auction.imageUrl}
          alt={auction.name}
          className="w-full h-64 object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{auction.name}</h1>
          <p className="text-gray-600 mb-4">{auction.description}</p>
          <p className="text-lg font-semibold">
            Current Bid: {formatCurrency(getHighestBid())}
          </p>
          
          <form onSubmit={handleBidSubmit} className="mt-4">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid"
              className="border p-2 rounded-md"
              required
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Place Bid
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Bid History</h2>
        {bids.length > 0 ? (
          <ul className="list-disc pl-6">
            {bids.map((b) => (
              <li key={b.id}>
                {b.user.username}: {formatCurrency(b.amount)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bids yet.</p>
        )}
      </div>
    </div>
  );
}

export default AuctionDetails;