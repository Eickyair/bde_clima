import { MapaEstados } from "./MapaEstados"
import { useMapas } from '../context/Mapas';
import { MapaMunicipios } from './MapaMunicipios';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import SerieTemporalMunicipio from "./SerieTemporalMunicipio";
export const Visualizacion = () => {
    const { idEstado, centroEstado, fecha, setFecha, resetEstado, metricaTmp, setMetricaTmp } = useMapas();
    return (
        <main>
            <h1>Visualización</h1>
            <Calendar value={fecha} onChange={(e) => {
                setFecha(e.value)
                resetEstado()
            }} showIcon />
            <Dropdown value={metricaTmp} options={[{ label: 'Máxima', value: 'max' }, { label: 'Mínima', value: 'min' }]} onChange={(e) => setMetricaTmp(e.value)} placeholder="Selecciona una métrica" />
            <div className="flex gap-5 p-10 items-start">
                <MapaEstados />
                {idEstado !== -1 && <div className="w-full flex flex-col"><MapaMunicipios geoJsonPath={`../data/municipios/${idEstado}.json`} /><SerieTemporalMunicipio/></div>}
            </div>
        </main>
    )
}