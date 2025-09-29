import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import auctionService from "../services/auctionService";
import bidService from "../services/bidService";

export default function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const a = await auctionService.getAuctionById(id);
        setAuction(a);
        const bs = await bidService.getBidsForAuction(id);
        setBids(bs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handlePlace = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert("Enter valid amount");
    try {
      await bidService.placeBid(id, { amount: Number(amount), user: { id: 1 } });
      // refresh bids
      const bs = await bidService.getBidsForAuction(id);
      setBids(bs || []);
      setAmount("");
      alert("Bid placed");
    } catch (err) {
      console.error(err);
      alert("Failed to place bid");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!auction) return <p>Auction not found</p>;

  return (
    <div>
      <h1>{auction.name}</h1>
      <img src={auction.imageUrl} alt={auction.name} style={{ width: "100%", maxHeight: 400, objectFit: "cover" }} />
      <p>{auction.description}</p>

      <form onSubmit={handlePlace} style={{ marginTop: 12 }}>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter your bid" />
        <button type="submit">Place Bid</button>
      </form>

      <h3 style={{ marginTop: 20 }}>Bid history</h3>
      <ul>
        {(bids || []).map(b => <li key={b.id}>{b.user?.username || "User"}: ₹{b.amount}</li>)}
      </ul>
    </div>
  );
}
