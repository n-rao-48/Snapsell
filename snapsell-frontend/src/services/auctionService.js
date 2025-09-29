import axiosInstance from "./axiosInstance";

const auctionService = {
  getAllAuctions: async () => {
    const res = await axiosInstance.get("/api/auctions");
    return res.data;
  },

  getAuctionById: async (id) => {
    const res = await axiosInstance.get(`/api/auctions/${id}`);
    return res.data;
  },

  createAuction: async (auctionData) => {
    const res = await axiosInstance.post("/api/auctions", auctionData);
    return res.data;
  },

  uploadImage: async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await axiosInstance.post("/api/auctions/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default auctionService;
