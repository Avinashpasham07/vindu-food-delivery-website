import apiClient from '../api/client';

const AuthService = {
    // User Login
    loginUser: async (credentials) => {
        const response = await apiClient.post('/auth/user/login', credentials);
        return response.data;
    },

    // User Register
    registerUser: async (userData) => {
        const response = await apiClient.post('/auth/user/register', userData);
        return response.data;
    },

    // User Logout
    logoutUser: async () => {
        const response = await apiClient.get('/auth/user/logout');
        return response.data;
    },

    // Partner Login (If needed in same service or separate)
    loginPartner: async (credentials) => {
        const response = await apiClient.post('/auth/foodpartner/login', credentials);
        return response.data;
    },

    // Partner Register
    registerPartner: async (partnerData) => {
        const response = await apiClient.post('/auth/foodpartner/register', partnerData);
        return response.data;
    }
};

export default AuthService;
