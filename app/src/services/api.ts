import axios from "axios";

const api = axios.create({
  baseURL: "http://10.39.191.220:8000",
});

export default api;