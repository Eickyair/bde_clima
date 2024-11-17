import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const MapasContext = createContext(null);

// Proveedor del contexto
export const MapasProvider = ({ children }) => {
    const [idEstado, setIdEstado] = useState(-1);
    const [fecha, setFecha] = useState(new Date());
    const [metricaTmp, setMetricaTmp] = useState('max');


    const [id_municipio, setIdMunicipio] = useState(-1);
    const resetEstado = () => {
        setIdEstado(-1);
        setIdMunicipio(-1);
        setMetricaTmp('max');
    };
    return (
        <MapasContext.Provider
            value={{
                idEstado,
                id_municipio,
                setIdMunicipio,
                setIdEstado,
                fecha,
                setFecha,
                metricaTmp,
                setMetricaTmp,
                resetEstado
            }}
        >
            {children}
        </MapasContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useMapas = () => {
    const context = useContext(MapasContext);
    if (!context) {
        throw new Error('useMapas debe ser usado dentro de un MapasProvider');
    }
    return context;
};
