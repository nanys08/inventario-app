import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.18.6:8080', // 👈 IP del backend (cámbiala si es otra)
  timeout: 5000,
});
