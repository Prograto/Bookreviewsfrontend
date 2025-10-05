import axios from 'axios';

const API_BASE = 'https://bookreviewsbackend.onrender.com/api';

// Function to get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

const client = axios.create({
  baseURL: API_BASE,
});

// Add Authorization header if token exists
client.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default client;


