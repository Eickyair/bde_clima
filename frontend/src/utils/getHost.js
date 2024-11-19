export const getHost = () => {
    const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
    return API_ENDPOINT+'/api';
}