const USE_LOCAL_BACKEND = import.meta.env.VITE_USE_LOCAL_BACKEND === 'true';

export const API_BASE_URL = USE_LOCAL_BACKEND
    ? (import.meta.env.VITE_LOCAL_PORT || 'http://localhost:8080')
    : (import.meta.env.VITE_BACKEND_URL || 'https://btw-backend-746138511086.northamerica-northeast1.run.app');

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
