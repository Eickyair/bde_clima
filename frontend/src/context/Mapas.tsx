import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

// Definir la interfaz para el contexto
interface MapasContextProps {
    idEstado: number;
    setIdEstado: Dispatch<SetStateAction<number>>;
    centrosEstados: Record<string, any>; // Ajusta el tipo según la estructura real de centrosEstados
    setCentrosEstados: Dispatch<SetStateAction<Record<string, any>>>;
    fecha: Date;
    setFecha: Dispatch<SetStateAction<Date>>;
}

// Crear el contexto con tipo y valor inicial como null
const MapasContext = createContext<MapasContextProps | null>(null);

// Definir el tipo para las props del proveedor
interface MapasProviderProps {
    children: ReactNode;
}

// Proveedor del contexto con tipos
export const MapasProvider: React.FC<MapasProviderProps> = ({ children }) => {
    const [idEstado, setIdEstado] = useState<number>(-1);
    const [centrosEstados, setCentrosEstados] = useState<Record<string, any>>({});
    const [fecha, setFecha] = useState<Date>(new Date());

    return (
        <MapasContext.Provider value={{ idEstado, setIdEstado, centrosEstados, setCentrosEstados, fecha, setFecha }}>
            {children}
        </MapasContext.Provider>
    );
};

// Hook personalizado para usar el contexto con tipos
export const useMapas = (): MapasContextProps => {
    const context = useContext(MapasContext);
    if (!context) {
        throw new Error('useMapas debe ser usado dentro de un MapasProvider');
    }
    return context;
};
