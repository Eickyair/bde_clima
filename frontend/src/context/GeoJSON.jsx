import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const GeoJSONContext = createContext();

// Proveedor del contexto
export const GeoJSONProvider = ({ children }) => {
    const [geoJSONCache, setGeoJSONCache] = useState({});

    const addGeoJSON = (id, geoJSON) => {
        setGeoJSONCache(prevCache => ({
            ...prevCache,
            [id]: geoJSON
        }));
    };

    const getGeoJSON = (id) => {
        return geoJSONCache[id];
    };

    return (
        <GeoJSONContext.Provider value={{ geoJSONCache, addGeoJSON, getGeoJSON }}>
            {children}
        </GeoJSONContext.Provider>
    );
};

// Hook para usar el contexto
export const useGeoJSON = () => {
    return useContext(GeoJSONContext);
};