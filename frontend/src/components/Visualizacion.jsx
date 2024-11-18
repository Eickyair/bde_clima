import { MapaEstados } from "./MapaEstados"
import { useMapas } from '../context/Mapas';
import {MapaMunicipios} from './MapaMunicipios';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from 'primereact/floatlabel';

import SerieTemporalMunicipio from "./SerieTemporalMunicipio";
export const Visualizacion = () => {
    const { idEstado, fecha, setFecha, resetEstado, metricaTmp, setMetricaTmp } = useMapas();
    return (
        <main className="px-10 py-5">
            <h1 className="text-5xl font-roboto text-center">Visualización</h1>
            <div className="flex gap-2">
            <FloatLabel>
                <Calendar id="fecha" value={fecha} onChange={(e) => {
                    setFecha(e.value)
                    resetEstado()
                }} showIcon />
                <label htmlFor="fecha">Fecha</label>
            </FloatLabel>
            <FloatLabel>
                <Dropdown
                    value={metricaTmp}
                    options={[
                        { label: 'Temperatura Máxima', value: 'max' },
                        { label: 'Temperatura Mínima', value: 'min' }
                    ]}
                    onChange={(e) => setMetricaTmp(e.value)}
                    placeholder="Seleccione una métrica"
                />
                <label htmlFor="metrica">Métrica</label>
            </FloatLabel>
            </div>
            <div className="flex gap-5 p-10 items-start bg-neutral-900">
                <MapaEstados />
                {
                    idEstado !== -1 && <div className="w-full flex flex-col">
                        <h2 className="text-center text-2xl font-normal font-roboto">Municipios</h2>
                        <MapaMunicipios
                        />
                        <SerieTemporalMunicipio />
                    </div>
                }
            </div>
        </main>
    )
}