
const BASE_URL = '/api';

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
    GOOGLE_LOGIN: `${BASE_URL}/auth/google`,
  },
  RESTAURANTS: {
    GET_ALL: `${BASE_URL}/restaurants`,
    GET_BY_ID: (id) => `${BASE_URL}/restaurants/${id}`, // Dynamic route
    CREATE: `${BASE_URL}/restaurants`,
  },
};

export default API_ENDPOINTS;
