import axios from "axios"

// Em produção, defina VITE_API_URL (ex.: https://minha-api.com) no arquivo .env do frontend

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
})

export default api;