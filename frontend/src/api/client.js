import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Fallback for safety
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor



apiClient.interceptors.request.use(
    (config) => {
        // Browser handles cookies automatically with 'withCredentials: true'
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Centralized Error Handling
        if (error.response) {
            // Server responded with a status code outside of 2xx
            console.error('[API Error]', error.response.status, error.response.data.message || error.message);

            if (error.response.status === 401) {
                // Unauthorized - clear user data if needed or redirect
                // localStorage.removeItem('user');
                // localStorage.removeItem('token');
                // window.location.href = '/user/login'; // Optional: Redirect to login
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('[API Error] No response received:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('[API Error] Request setup failed:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
