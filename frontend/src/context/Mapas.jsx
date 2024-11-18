import { createContext, useContext,useReducer } from 'react';

const MapasContext = createContext(null);
// Definir las acciones del reducer
const SET_ID_ESTADO = 'SET_ID_ESTADO';
const SET_FECHA = 'SET_FECHA';
const SET_METRICA_TMP = 'SET_METRICA_TMP';
const SET_ID_MUNICIPIO = 'SET_ID_MUNICIPIO';
const RESET_ESTADO = 'RESET_ESTADO';

const mapasReducer = (state, action) => {
    switch (action.type) {
        case SET_ID_ESTADO:
            return { ...state, idEstado: action.payload };
        case SET_FECHA:
            return { ...state, fecha: action.payload };
        case SET_METRICA_TMP:
            return { ...state, metricaTmp: action.payload };
        case SET_ID_MUNICIPIO:
            return { ...state, id_municipio: action.payload };
        case RESET_ESTADO:
            return { ...state, idEstado: -1, id_municipio: -1, metricaTmp: 'max' };
        default:
            return state;
    }
};
export const MapasProvider = ({ children }) => {
    const initialState = {
        idEstado: -1,
        fecha: new Date(),
        metricaTmp: 'max',
        id_municipio: -1
    };

    const [state, dispatch] = useReducer(mapasReducer, initialState);

    const setIdEstado = (idEstado) => dispatch({ type: SET_ID_ESTADO, payload: idEstado });
    const setFecha = (fecha) => dispatch({ type: SET_FECHA, payload: fecha });
    const setMetricaTmp = (metricaTmp) => dispatch({ type: SET_METRICA_TMP, payload: metricaTmp });
    const setIdMunicipio = (id_municipio) => dispatch({ type: SET_ID_MUNICIPIO, payload: id_municipio });
    const resetEstado = () => dispatch({ type: RESET_ESTADO });

    return (
        <MapasContext.Provider
            value={{
                idEstado: state.idEstado,
                id_municipio: state.id_municipio,
                setIdMunicipio,
                setIdEstado,
                fecha: state.fecha,
                setFecha,
                metricaTmp: state.metricaTmp,
                setMetricaTmp,
                resetEstado
            }}
        >
            {children}
        </MapasContext.Provider>
    );
};

export const useMapas = () => {
    const context = useContext(MapasContext);
    if (!context) {
        throw new Error('useMapas debe ser usado dentro de un MapasProvider');
    }
    return context;
};
