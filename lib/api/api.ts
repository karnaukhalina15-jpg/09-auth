import axios from "axios";

// Pobieramy URL z enviroment variables i dodajemy ścieżkę /api
const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// Tworzymy wspólną instancję Axios
export const noteApi = axios.create({
  baseURL,
  withCredentials: true,
});
