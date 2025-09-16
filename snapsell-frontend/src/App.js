import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./api/components/Navbar";
import Home from "./pages/Home";
import AuctionDetails from "./pages/AuctionDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auction/:id" element={<AuctionDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
