import axios from 'axios';

// const API_URL = 'http://192.168.0.5:8000/api/';
const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        // Do NOT add Authorization header for login or refresh requests
        const isTokenEndpoint = config.url.includes('token/') || config.url.includes('token/refresh/');
        if (token && token !== 'undefined' && token !== 'null' && !isTokenEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic if the request was to a token endpoint (prevents loop/wrong error)
        const isTokenEndpoint = originalRequest.url.includes('token/') || originalRequest.url.includes('token/refresh/');

        if (error.response.status === 401 && !originalRequest._retry && !isTokenEndpoint) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken && refreshToken !== 'null' && refreshToken !== 'undefined') {
                try {
                    const response = await axios.post(`${API_URL}token/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username, password) => {
        const response = await api.post('token/', { username, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },
    getProfile: async () => {
        const response = await api.get('accounts/profile/');
        return response.data;
    },
    registerPatient: async (data) => {
        const response = await api.post('accounts/register/patient/', data);
        return response.data;
    },
    registerDoctor: async (data) => {
        const response = await api.post('accounts/register/doctor/', data);
        return response.data;
    },
};

export const mainService = {
    getPatients: async () => {
        const response = await api.get('main/patients/');
        return response.data;
    },
    getDoctors: async () => {
        const response = await api.get('main/doctors/');
        return response.data;
    },
    predictDisease: async (symptoms) => {
        const response = await api.post('main/predict/', { symptoms });
        return response.data;
    },
    getConsultations: async () => {
        const response = await api.get('main/consultations/');
        return response.data;
    },
    createConsultation: async (data) => {
        const response = await api.post('main/consultations/', data);
        return response.data;
    },
    closeConsultation: async (id) => {
        const response = await api.post(`main/consultations/${id}/close/`);
        return response.data;
    },
};

export const chatService = {
    getMessages: async (consultationId) => {
        const response = await api.get('chats/messages/', {
            params: { consultation_id: parseInt(consultationId) },
        });
        return response.data;
    },
    sendMessage: async (consultationId, message) => {
        const response = await api.post('chats/messages/', {
            consultation_id: parseInt(consultationId),
            message,
        });
        return response.data;
    },
};

export const medicineService = {
    search: async (diseaseName) => {
        const response = await api.post('medicine/search/', { diseaseName });
        return response.data;
    },
};

export default api;
