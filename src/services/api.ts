import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

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
