const DEFAULT_LOCAL_API_URL = 'http://localhost:4000';
const DEFAULT_PRODUCTION_API_URL = 'https://annieshop-backend.onrender.com';
const isBrowser = typeof window !== 'undefined';
const isLocalHost =
  isBrowser &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocalHost ? DEFAULT_LOCAL_API_URL : DEFAULT_PRODUCTION_API_URL);

export default API_BASE_URL;
