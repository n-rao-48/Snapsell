import { useEffect, useState } from "react";
import { getAllAuctions } from "../api/auctionService"; // Import the API service
import AuctionCard from "../components/AuctionCard";
import FileUpload from "../components/FileUpload";
import SearchBar from "../components/SearchBar";
import "./Auctions.css"; // Import the CSS file

function Auctions() {
  const [auctions, setAuctions] = useState([]); // State for auction data
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Antiques", "Art", "Jewelry"];

  // Fetch auctions from the backend
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await getAllAuctions(); // Fetch data from the backend
        setAuctions(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  // Filter auctions based on search and category
  const filteredAuctions = auctions.filter((a) => {
    const matchCategory = category === "All" || a.category === category;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="container">
      <h1>Available Auctions</h1>

      {/* Search Bar */}
      <SearchBar onSearch={setSearch} />

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="container">
        <h1>Available Auctions</h1>
        {/* Add the FileUpload component */}
        <FileUpload />
        {/* Other components like AuctionCard */}
      </div>
      {/* Auction Cards */}
      <div className="cards-container">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))
        ) : (
          <p>No auctions found.</p>
        )}
      </div>
    </div>
  );
}

export default Auctions;