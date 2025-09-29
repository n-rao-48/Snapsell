import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuctionCard from "../api/components/AuctionCard";
import SearchBar from "../api/components/SearchBar";
import auctionService from "../services/auctionService";
import "./Auctions.css";

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [condition, setCondition] = useState("All");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [searchParams, setSearchParams] = useSearchParams();

  const categories = [
    { value: "All", label: "All Categories", count: 0 },
    { value: "Mobiles", label: "Mobiles", count: 0 },
    { value: "Laptops", label: "Laptops", count: 0 },
    { value: "Books", label: "Books", count: 0 },
    { value: "Electronics", label: "Electronics", count: 0 },
    { value: "Furniture", label: "Furniture", count: 0 },
    { value: "Accessories", label: "Accessories", count: 0 }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "ending", label: "Ending Soon" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
    { value: "bids", label: "Most Bids" }
  ];

  const conditionOptions = ["All", "New", "Excellent", "Good", "Fair"];

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await auctionService.getAllAuctions();
        setAuctions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam && categoryParam !== category) {
      setCategory(categoryParam);
    }
    if (searchParam && searchParam !== search) {
      setSearch(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = auctions.filter(auction => {
      const matchesCategory = category === "All" || auction.category === category;
      
      const matchesSearch = !search || 
        (auction.name && auction.name.toLowerCase().includes(search.toLowerCase())) ||
        (auction.description && auction.description.toLowerCase().includes(search.toLowerCase()));
      
      const currentBid = getCurrentBid(auction);
      const matchesPrice = currentBid >= priceRange[0] && currentBid <= priceRange[1];
      
      const matchesCondition = condition === "All" || auction.condition === condition;

      return matchesCategory && matchesSearch && matchesPrice && matchesCondition;
    });

    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.startTime || 0) - new Date(a.createdAt || a.startTime || 0);
        case "ending":
          return new Date(a.endTime || 0) - new Date(b.endTime || 0);
        case "price-low":
          return getCurrentBid(a) - getCurrentBid(b);
        case "price-high":
          return getCurrentBid(b) - getCurrentBid(a);
        case "bids":
          return (b.bids?.length || 0) - (a.bids?.length || 0);
        case "popular":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredAuctions(filtered);
    setCurrentPage(1);
  }, [auctions, search, category, sortBy, priceRange, condition]);

  const getCurrentBid = (auction) => {
    if (auction.bids && auction.bids.length > 0) {
      const highest = auction.bids.reduce((max, bid) => (max.amount > bid.amount ? max : bid));
      return highest.amount;
    }
    return auction.price || 0;
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateURL({ category: newCategory === "All" ? null : newCategory });
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    updateURL({ search: newSearch || null });
  };

  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("newest");
    setPriceRange([0, 100000]);
    setCondition("All");
    setSearchParams({});
  };

  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryCount = (catValue) => {
    if (catValue === "All") return auctions.length;
    return auctions.filter(a => a.category === catValue).length;
  };

  if (loading) {
    return (
      <div className="auctions-container">
        <div className="auctions-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-search"></div>
        </div>
        <div className="auctions-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="auction-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="auctions-container">
      <div className="auctions-header">
        <div className="header-content">
          <h1 className="page-title">
            Browse Auctions
            <span className="results-count">({filteredAuctions.length} items)</span>
          </h1>
          <p className="page-subtitle">
            Discover amazing deals from fellow students in your community
          </p>
        </div>

        <SearchBar 
          search={search}
          setSearch={handleSearchChange}
          category={category}
          setCategory={handleCategoryChange}
        />
      </div>

      <div className="controls-section">
        <div className="controls-left">
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`category-pill ${category === cat.value ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
              >
                <span className="pill-label">{cat.label}</span>
                <span className="pill-count">{getCategoryCount(cat.value)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="controls-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button 
            className="filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Filters
            {(condition !== "All" || priceRange[0] > 0 || priceRange[1] < 100000) && (
              <span className="filters-badge"></span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="Min"
                  className="price-input"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  placeholder="Max"
                  className="price-input"
                />
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="price-slider"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Condition</label>
              <div className="condition-options">
                {conditionOptions.map(cond => (
                  <button
                    key={cond}
                    className={`condition-btn ${condition === cond ? 'active' : ''}`}
                    onClick={() => setCondition(cond)}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {(search || category !== "All" || condition !== "All") && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {search && (
            <span className="filter-tag">
              Search: "{search}"
              <button onClick={() => handleSearchChange("")}>×</button>
            </span>
          )}
          {category !== "All" && (
            <span className="filter-tag">
              Category: {category}
              <button onClick={() => handleCategoryChange("All")}>×</button>
            </span>
          )}
          {condition !== "All" && (
            <span className="filter-tag">
              Condition: {condition}
              <button onClick={() => setCondition("All")}>×</button>
            </span>
          )}
          <button className="clear-all-btn" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      )}

      {filteredAuctions.length > 0 ? (
        <>
          <div className={`auctions-${viewMode}`}>
            {paginatedAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        className={`page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-results">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3>No auctions found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button className="btn-primary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}