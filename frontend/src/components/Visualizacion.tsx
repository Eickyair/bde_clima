import { MapaEstados } from "./MapaEstados";
import { useMapas } from '../context/Mapas';
import { MapaMunicipios } from './MapaMunicipios';
import { Calendar, CalendarViewChangeEvent } from "primereact/calendar";

export const Visualizacion: React.FC = () => {
    const { idEstado, fecha, setFecha } = useMapas();


    return (
        <main>
            <h1>Visualización</h1>
            <Calendar value={fecha} onChange={e => {
                if (e.value instanceof Date) {
                    setFecha(e.value);
                }
            }} showIcon />
            <div className="flex">
                <MapaEstados />
                {idEstado !== -1 && (
                    <MapaMunicipios
                        geoJsonPath={`../data/municipios/${idEstado}.json`}
                    />
                )}
            </div>
        </main>
    );
};

export default Visualizacion;
