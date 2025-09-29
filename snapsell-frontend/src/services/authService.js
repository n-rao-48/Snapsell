import axiosInstance from "./axiosInstance";

const authService = {
  register: async (username, email, password, phone) => {
    const res = await axiosInstance.post("/auth/register", { username, email, password, phone });
    return res.data;
  },
  login: async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    // backend returns { token: "..." } or just token depending; normalize:
    if (res.data && res.data.token) return res.data.token;
    return res.data;
  },
};

export default authService;
