import axiosInstance from "./axiosInstance";

const bidService = {
  placeBid: async (auctionId, bid) => {
    const res = await axiosInstance.post(`/bids/${auctionId}`, bid);
    return res.data;
  },

  getBidsForAuction: async (auctionId) => {
    const res = await axiosInstance.get(`/bids/${auctionId}`);
    return res.data;
  },
};

export default bidService;
