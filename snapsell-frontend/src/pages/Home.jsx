import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuctionCard from "../api/components/AuctionCard";
import SearchBar from "../api/components/SearchBar";
import auctionService from "../services/auctionService";
import "./Home.css";

export default function Home() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await auctionService.getAllAuctions();
        setAuctions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = [
    { name: "Mobiles", icon: "📱", color: "bg-blue-100 text-blue-800" },
    { name: "Laptops", icon: "💻", color: "bg-green-100 text-green-800" },
    { name: "Books", icon: "📚", color: "bg-purple-100 text-purple-800" },
    { name: "Electronics", icon: "🔌", color: "bg-orange-100 text-orange-800" },
    { name: "Furniture", icon: "🪑", color: "bg-amber-100 text-amber-800" },
    { name: "Accessories", icon: "⌚", color: "bg-pink-100 text-pink-800" }
  ];

  const stats = [
    { label: "Active Auctions", value: "150+", icon: "🔥" },
    { label: "Happy Students", value: "2.5K+", icon: "😊" },
    { label: "Items Sold", value: "5K+", icon: "📦" },
    { label: "Colleges", value: "25+", icon: "🏫" }
  ];

  const filteredAuctions = auctions.filter(a => {
    const matchesCategory = category === "All" || (a.category && a.category === category);
    const matchesSearch = a.name && a.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingAuctions = auctions.slice(0, 8);
  const recentAuctions = auctions.slice(8, 16);

  if (loading) {
    return (
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-skeleton"></div>
        </div>
        <div className="auction-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="auction-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Buy & Sell in Your
              <span className="gradient-text"> Hostel Community</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing deals on electronics, books, and more from fellow students. 
              Safe, trusted, and designed for hostel life.
            </p>
            <div className="hero-actions">
              <Link to="/auctions" className="btn-primary">
                Browse Auctions
              </Link>
              <Link to="/create" className="btn-secondary">
                Start Selling
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="floating-card card-1">
                <span className="card-icon">📱</span>
                <span className="card-text">iPhone 12</span>
                <span className="card-price">₹45,000</span>
              </div>
              <div className="floating-card card-2">
                <span className="card-icon">💻</span>
                <span className="card-text">MacBook</span>
                <span className="card-price">₹85,000</span>
              </div>
              <div className="floating-card card-3">
                <span className="card-icon">📚</span>
                <span className="card-text">Engineering Books</span>
                <span className="card-price">₹2,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hero-search">
          <SearchBar 
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/auctions?category=${cat.name}`}
              className="category-card"
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
              <div className={`category-badge ${cat.color}`}>
                {auctions.filter(a => a.category === cat.name).length} items
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Auctions */}
      <section className="auctions-section">
        <div className="section-header">
          <h2 className="section-title">🔥 Trending Now</h2>
          <Link to="/auctions" className="view-all-link">
            View All <span className="arrow">→</span>
          </Link>
        </div>
        <div className="auction-grid">
          {trendingAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </section>

      {/* Recent Auctions */}
      <section className="auctions-section">
        <div className="section-header">
          <h2 className="section-title">✨ Recently Added</h2>
          <Link to="/auctions" className="view-all-link">
            View All <span className="arrow">→</span>
          </Link>
        </div>
        <div className="auction-grid">
          {recentAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Selling?</h2>
          <p className="cta-subtitle">
            Turn your unused items into cash. It's quick, easy, and secure.
          </p>
          <Link to="/create" className="btn-primary">
            Create Your First Auction
          </Link>
        </div>
        <div className="cta-visual">
          <div className="success-animation">
            <span className="success-icon">🎉</span>
            <span className="success-text">Sold!</span>
          </div>
        </div>
      </section>
    </div>
  );
}