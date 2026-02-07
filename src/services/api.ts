import axios from 'axios';

const API_URL = '/api/auth';
const api = axios.create({
    baseURL: API_URL,
});

export const registerUser = async (formData: FormData) => {
    try {
        const response = await api.post('/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (data: any) => {
    try {
        const response = await api.post('/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCurrentUser = async (token: string) => {
    try {
        const response = await api.get('/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchReligions = async () => {
    try {
        const response = await axios.get('/api/masters/religions');
        return response.data.religions;
    } catch (error) {
        throw error;
    }
};

export const fetchCastes = async (religionId: number) => {
    try {
        const response = await axios.get(`/api/masters/religions/${religionId}/castes`);
        return response.data.castes;
    } catch (error) {
        throw error;
    }
};

export const fetchSubcastes = async (casteId: number) => {
    try {
        const response = await axios.get(`/api/masters/castes/${casteId}/subcastes`);
        return response.data.subcastes;
    } catch (error) {
        throw error;
    }
};

export const processPayment = async (amount: number, token: string) => {
    try {
        const response = await axios.post('/api/payment/process', { amount }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const approveUser = async (userId: number, token: string) => {
    try {
        const response = await axios.patch(`/api/admin/users/${userId}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAdminUserById = async (userId: number, token: string) => {
    try {
        const response = await axios.get(`/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAdminUser = async (userId: number, data: any, token: string) => {
    try {
        const response = await axios.put(`/api/admin/users/${userId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPaginatedUsers = async (params: any, token: string) => {
    try {
        const response = await axios.get('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPaginatedPayments = async (params: any, token: string) => {
    try {
        const response = await axios.get('/api/admin/payments', {
            headers: { Authorization: `Bearer ${token}` },
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// User Dashboard APIs
export const fetchDashboardStats = async (token: string) => {
    try {
        const response = await axios.get('/api/user/dashboard-stats', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchRecommendations = async (token: string) => {
    try {
        const response = await axios.get('/api/user/recommendations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchShortlists = async (token: string) => {
    try {
        const response = await axios.get('/api/user/shortlists', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const toggleShortlist = async (profileId: number, token: string) => {
    try {
        const response = await axios.post('/api/user/shortlist', { profileId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendInterest = async (receiverId: number, token: string) => {
    try {
        const response = await axios.post('/api/user/interest', { receiverId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const recordProfileView = async (profileId: number, token: string) => {
    try {
        const response = await axios.post('/api/user/record-view', { profileId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchRecentActivity = async (token: string) => {
    try {
        const response = await axios.get('/api/user/recent-activity', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchBrowseProfiles = async (params: any, token: string) => {
    try {
        const response = await axios.get('/api/user/browse', {
            headers: { Authorization: `Bearer ${token}` },
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
