import axios from "axios";

// Зчитуємо змінну з .env (http://localhost:3000 локально або домен на Vercel)
const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const noteApi = axios.create({
  baseURL,
  withCredentials: true,
});
