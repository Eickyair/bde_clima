import { useState, useEffect } from 'react';

export const useApi = (endpoint, queryParams = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`http://localhost:3000/api/${endpoint}?${queryString}`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint, JSON.stringify(queryParams)]);

    return { data, isLoading, error, refetch: fetchData };
};