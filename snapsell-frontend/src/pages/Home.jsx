import { useEffect, useState } from "react";
import AuctionCard from "../api/components/AuctionCard";
import SearchBar from "../api/components/SearchBar";
import "./Home.css";

function Home() {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auctions");
        if (!response.ok) {
          throw new Error("Failed to fetch auctions.");
        }
        const data = await response.json();
        setAuctions(data);
        setFilteredAuctions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    const filtered = auctions.filter((a) =>
      (category === "All" || a.category === category) &&
      a.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAuctions(filtered);
  }, [auctions, search, category]);

  if (loading) return <p className="p-6">Loading auctions...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Available Auctions</h1>
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAuctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
}

export default Home;