// utils/clientServer.js
import axios from "axios";

export const BASE_URL = "https://tribenet.onrender.com/";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
