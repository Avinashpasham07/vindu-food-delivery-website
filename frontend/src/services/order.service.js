import apiClient from '../api/client';

const OrderService = {
    // Get Order Details (Tracking)
    getOrderDetails: async (orderId) => {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data;
    },

    // Create Order
    createOrder: async (orderData) => {
        const response = await apiClient.post('/orders/place', orderData);
        return response.data;
    },

    // Get User Orders
    getUserOrders: async () => {
        const response = await apiClient.get('/orders/user');
        return response.data;
    },

    // Get Partner Orders
    getPartnerOrders: async () => {
        const response = await apiClient.get('/orders/partner');
        return response.data;
    }
};

export default OrderService;
