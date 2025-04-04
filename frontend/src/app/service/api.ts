import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response)=>response,
  (error) => {
    if (error.response.status === 401) {
      // redirect to login page
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      }
      return Promise.reject(error);
      }
)

export const folderApi = {
  getAll: () => api.get('/folder/all'),
  create: (name: string) => api.post('/folder', { name }),
  update: (id: number, name: string) => api.put(`/folder/${id}`, { name }),
  delete: (id: number) => api.delete(`/folder/${id}`),
};

export const noteApi = {
  getByFolder: (folderId: number) => api.get(`/note/folder/${folderId}`),
  create: (note: { text: string; folderId: number }) => api.post('/note', note),
  update: (id: number, text: string) => api.put(`/note/${id}`, { text }),
  delete: (id: number) => api.delete(`/note/${id}`),
};

export const isAuthenticated = ()=>{
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('authToken');
}
return false;
};

export const logout=()=>{
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

export default api;