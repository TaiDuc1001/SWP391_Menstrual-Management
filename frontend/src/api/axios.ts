import axios from 'axios';

const url = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const api = axios.create({
  baseURL: url,
});

export default api;
