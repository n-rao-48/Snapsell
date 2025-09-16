import "./SearchBar.css";


function SearchBar({ search, setSearch, category, setCategory }) {
  return (
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Search auctions..."
        className="border p-2 rounded flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>All</option>
        <option>Mobiles</option>
        <option>Laptops</option>
        <option>Accessories</option>
      </select>
    </div>
  );
}
export default SearchBar;
