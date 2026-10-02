import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const getMachines = () => api.get('/machines');
export const getRecentPredictions = () => api.get('/predictions/recent');
export const predict = (payload) => api.post('/predictions', payload);
export default api;
