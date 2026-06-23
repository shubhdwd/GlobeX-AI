import axios from 'axios';

// Create a singleton to hold the token in memory
export const tokenStore = {
  token: null,
  set: (t) => { tokenStore.token = t; },
  get: () => tokenStore.token,
  clear: () => { tokenStore.token = null; },
};

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401s (token refresh)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('globex_refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        tokenStore.clear();
        return Promise.reject(error);
      }

      try {
        // Direct axios call to avoid interceptor loop
        const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
        const newTokens = data.data;

        tokenStore.set(newTokens.accessToken);
        localStorage.setItem('globex_refresh_token', newTokens.refreshToken);
        
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newTokens.accessToken;
        originalRequest.headers.Authorization = 'Bearer ' + newTokens.accessToken;
        
        processQueue(null, newTokens.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStore.clear();
        localStorage.removeItem('globex_refresh_token');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ──────────────────────────────────────────────────────────────
export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (accessToken) => api.post('/auth/google', { accessToken }),
  logout: ()     => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};
