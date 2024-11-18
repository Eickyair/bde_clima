import { useState, useEffect } from 'react';
export const useApi = (endpoint, queryParams = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
    const fetchData = async (attempt = 1) => {
        setIsLoading(true);
        try {
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`${API_ENDPOINT}/api/${endpoint}?${queryString}`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            if (attempt < 3) {
                fetchData(attempt + 1);
            } else {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint, JSON.stringify(queryParams)]);

    return { data, isLoading, error, refetch: fetchData };
};