import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    headers: {
        "Content-Type" : "application/json",
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callApi = async (
    endpoint: string, 
    method = "GET", 
    data?: object | null) => {
    try {
        const response = await apiClient({
            url: endpoint,
            method: method,
            data: data
        })
        return response.data
    } catch (error) {
        console.error("API call error:", error);
        throw error;
    }
}