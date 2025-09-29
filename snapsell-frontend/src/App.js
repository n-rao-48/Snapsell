import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./api/components/Navbar";
import ProtectedRoute from "./api/components/ProtectedRoute";
import AuctionDetails from "./pages/AuctionDetails";
import Auctions from "./pages/Auctions";
import CreateAuction from "./pages/CreateAuction";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create" element={<CreateAuction />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
