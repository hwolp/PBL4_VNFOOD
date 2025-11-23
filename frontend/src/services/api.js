import axios from 'axios';
import { API_URL, PI_STREAM_URL } from '../utils/constants';

export const createApiInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
};

export const authApi = {
  register: (username, password) =>
    axios.post(`${API_URL}/register`, { username, password }),

  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return axios.post(`${API_URL}/login`, formData);
  },

  checkAuth: () =>
    createApiInstance().get('/me')
};

export const recognitionApi = {
  predict: (imageBlob, language) => {
    const formData = new FormData();
    formData.append('file', imageBlob, "capture.jpg");
    return axios.post(`${API_URL}/predict?language=${language}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  captureFromPi: () => {
    return axios.get(`${API_URL}/capture_from_pi`, {
      responseType: 'blob'
    });
  }
};

export const historyApi = {
  getHistory: (language) =>
    createApiInstance().get(`/history?language=${language}`),

  saveHistory: (dishId) =>
    createApiInstance().post('/save_history', { dish_id: dishId }, {
      headers: { 'Content-Type': 'application/json' }
    })
};

export const favoritesApi = {
  add: (dishId) =>
    createApiInstance().post('/favorites', { dish_id: dishId }, {
      headers: { 'Content-Type': 'application/json' }
    }),

  remove: (dishId) =>
    createApiInstance().delete(`/favorites/${dishId}`),

  getAll: (language) =>
    createApiInstance().get(`/favorites?language=${language}`),

  check: (dishId) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.get(`${API_URL}/favorites/check/${dishId}`, { headers });
  }
};

export const dishesApi = {
  getAll: (params) => axios.get(`${API_URL}/dishes`, { params }),
  getDetail: (dishId, language = 'vi') => axios.get(`${API_URL}/dishes/${dishId}?language=${language}`),
  getIngredients: (language = 'vi') => axios.get(`${API_URL}/ingredients?language=${language}`)
};

export const shoppingListApi = {
  create: (name) =>
    createApiInstance().post('/shopping-lists', { name }, {
      headers: { 'Content-Type': 'application/json' }
    }),
  
  getAll: () =>
    createApiInstance().get('/shopping-lists'),
  
  getDetail: (listId) =>
    createApiInstance().get(`/shopping-lists/${listId}`),
  
  addItem: (listId, item) =>
    createApiInstance().post(`/shopping-lists/${listId}/items`, item, {
      headers: { 'Content-Type': 'application/json' }
    }),
  
  addDish: (listId, dishId) =>
    createApiInstance().post('/shopping-lists/add-dish', { list_id: listId, dish_id: dishId }, {
      headers: { 'Content-Type': 'application/json' }
    }),
  
  updateItem: (listId, itemId, item) =>
    createApiInstance().put(`/shopping-lists/${listId}/items/${itemId}`, item, {
      headers: { 'Content-Type': 'application/json' }
    }),
  
  deleteItem: (listId, itemId) =>
    createApiInstance().delete(`/shopping-lists/${listId}/items/${itemId}`),
  
  deleteList: (listId) =>
    createApiInstance().delete(`/shopping-lists/${listId}`)
};

export { API_URL, PI_STREAM_URL };

