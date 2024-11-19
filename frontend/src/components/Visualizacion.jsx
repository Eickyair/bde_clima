import { MapaEstados } from "./MapaEstados"
import { useMapas } from '../context/Mapas';
import { MapaMunicipios } from './MapaMunicipios';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from 'primereact/floatlabel';
import TemperatureChart from "./TemperatureChart";
export const Visualizacion = () => {
    const { idEstado, fecha, setFecha, resetEstado, metricaTmp, setMetricaTmp } = useMapas();
    return (
        <main className="px-10 py-5">
            {/* Panel */}
            <div>
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
            </div>
            <div className="flex gap-5 p-10 bg-neutral-900 mt-10">
                <div className="w-1/3">
                    <h2 className="text-3xl text-center mb-3 font-roboto">Estados de Mexico</h2>
                    <div className="h-[600px] rounded-lg overflow-hidden">
                        <MapaEstados />
                    </div>
                </div>
                <div className="w-2/3 flex-col">
                    <h2 className="text-3xl text-center mb-3 font-roboto">Municipios</h2>
                    {
                        idEstado !== -1 && (
                            <div className="h-[240px] rounded-lg overflow-hidden">
                                <MapaMunicipios />
                            </div>
                        )
                    }
                    <div className="mt-10">
                        <TemperatureChart h={550 - 240} w={'100%'} />
                    </div>
                </div>
            </div>
        </main>
    )
}