import { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

function SearchBar({ search, setSearch, category, setCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const categories = [
    { value: "All", label: "All Categories", icon: "🌟", count: 245 },
    { value: "Mobiles", label: "Mobiles", icon: "📱", count: 68 },
    { value: "Laptops", label: "Laptops", icon: "💻", count: 42 },
    { value: "Books", label: "Books", icon: "📚", count: 156 },
    { value: "Electronics", label: "Electronics", icon: "🔌", count: 89 },
    { value: "Furniture", label: "Furniture", icon: "🪑", count: 34 },
    { value: "Accessories", label: "Accessories", icon: "⌚", count: 78 }
  ];

  // Mock suggestions - in real app, this would come from an API
  const mockSuggestions = [
    "iPhone 13", "MacBook Pro", "Samsung Galaxy", "iPad", "AirPods",
    "Engineering Books", "Gaming Laptop", "Desk Chair", "Monitor",
    "Headphones", "Keyboard", "Mouse", "Textbooks", "Smartphone"
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Generate suggestions based on search input
    if (search.length > 0) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  useEffect(() => {
    // Handle clicking outside
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(value.length > 0 || isExpanded);
  };

  const handleSearchFocus = () => {
    setIsExpanded(true);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    setIsExpanded(false);
    
    // Add to recent searches
    const updated = [suggestion, ...recentSearches.filter(item => item !== suggestion)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Add to recent searches
      const updated = [search, ...recentSearches.filter(item => item !== search)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      setShowSuggestions(false);
      setIsExpanded(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === category) || categories[0];

  return (
    <div className={`search-bar-container ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        {/* Main Search Input */}
        <div className="search-input-container" ref={searchRef}>
          <div className="search-input-wrapper">
            {/* Search Icon */}
            <div className="search-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for items, brands, or categories..."
              className="search-input"
              value={search}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
            />

            {/* Voice Search Button */}
            <button type="button" className="voice-search-btn" title="Voice Search">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Clear Button */}
            {search && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Selector */}
        <div className="category-selector">
          <button type="button" className="category-btn">
            <span className="category-icon">{selectedCategory.icon}</span>
            <span className="category-text">{selectedCategory.label}</span>
            <span className="category-count">({selectedCategory.count})</span>
            <svg className="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Category Dropdown */}
          <div className="category-dropdown">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`category-option ${category === cat.value ? 'active' : ''}`}
                onClick={() => setCategory(cat.value)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-info">
                  <span className="category-name">{cat.label}</span>
                  <span className="category-count">{cat.count} items</span>
                </span>
                {category === cat.value && (
                  <svg className="check-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" className="search-submit-btn">
          <span className="btn-text">Search</span>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="suggestions-dropdown" ref={suggestionsRef}>
          <div className="suggestions-content">
            {/* Current Suggestions */}
            {suggestions.length > 0 && (
              <div className="suggestions-section">
                <h4 className="suggestions-title">
                  <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Suggestions
                </h4>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="suggestion-text">{suggestion}</span>
                    <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && suggestions.length === 0 && (
              <div className="suggestions-section">
                <div className="suggestions-header">
                  <h4 className="suggestions-title">
                    <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Searches
                  </h4>
                  <button 
                    className="clear-recent-btn"
                    onClick={clearRecentSearches}
                    title="Clear recent searches"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((recent, index) => (
                  <button
                    key={index}
                    className="suggestion-item recent-item"
                    onClick={() => handleSuggestionClick(recent)}
                  >
                    <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="suggestion-text">{recent}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {search.length === 0 && suggestions.length === 0 && (
              <div className="suggestions-section">
                <h4 className="suggestions-title">
                  <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Popular Searches
                </h4>
                {["iPhone", "MacBook", "Books", "Gaming Setup", "Furniture"].map((popular, index) => (
                  <button
                    key={index}
                    className="suggestion-item popular-item"
                    onClick={() => handleSuggestionClick(popular)}
                  >
                    <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="suggestion-text">{popular}</span>
                    <span className="trending-badge">Trending</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div className="quick-filters">
        <div className="filter-chips">
          <button className="filter-chip active">
            <span className="chip-icon">🔥</span>
            Hot Deals
          </button>
          <button className="filter-chip">
            <span className="chip-icon">⚡</span>
            Ending Soon
          </button>
          <button className="filter-chip">
            <span className="chip-icon">✨</span>
            New Today
          </button>
          <button className="filter-chip">
            <span className="chip-icon">💰</span>
            Under ₹1000
          </button>
          <button className="filter-chip">
            <span className="chip-icon">⭐</span>
            Top Rated
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;