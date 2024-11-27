import { MapaEstados } from "./MapaEstados";
import { useMapas } from "../context/Mapas";
import { MapaMunicipios } from "./MapaMunicipios";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import TemperatureChart from "./TemperatureChart";
import { useEstados } from "../hooks/useEstados";
import { useTemperatureChart } from "../hooks/useTemperatureChart";
import { useGetMunicipios } from "../hooks/useGetMunicipios";
export const Visualizacion = () => {
  const {
    idEstado,
    fecha,
    setFecha,
    resetEstado,
    metricaTmp,
    id_municipio,
    setMetricaTmp,
    setIdEstado,
    setIdMunicipio,
  } = useMapas();
  const { data, error, isLoading } = useEstados(fecha);
  const {
    data: resMunicipios,
    isLoading: isLoadingMun,
    error: errorMun,
  } = useTemperatureChart(idEstado, id_municipio, fecha);
  const { data: municipiosEstados } = useGetMunicipios(idEstado);
  return (
    <main className="px-10 py-5">
      {/* Panel */}
      <div>
        <h1 className="text-5xl font-roboto text-center">Visualización</h1>
        <div className="flex gap-2">
          <FloatLabel>
            <Calendar
              id="fecha"
              value={fecha}
              onChange={(e) => {
                setFecha(e.value);
                resetEstado();
              }}
              showIcon
            />
            <label htmlFor="fecha">Fecha</label>
          </FloatLabel>
          <FloatLabel>
            <Dropdown
              value={metricaTmp}
              options={[
                { label: "Temperatura Máxima", value: "max" },
                { label: "Temperatura Mínima", value: "min" },
              ]}
              onChange={(e) => setMetricaTmp(e.value)}
              placeholder="Seleccione una métrica"
            />
            <label htmlFor="metrica">Métrica</label>
          </FloatLabel>
          <FloatLabel>
            <Dropdown
              loading={isLoading}
              showClear
              options={
                data && data.data
                  ? data.data.map((estado) => {
                      return {
                        label: estado.nombre,
                        value: estado.id_estado,
                      };
                    })
                  : []
              }
              value={idEstado}
              onChange={(e) => {
                if (e.value === undefined) return resetEstado();
                setIdEstado(e.value);
                setIdMunicipio(-1);
              }}
              placeholder="Seleccione un estado"
            />
          </FloatLabel>
          <FloatLabel>
            <Dropdown
              disabled={idEstado === -1}
              value={id_municipio}
              onChange={(e) => {
                setIdMunicipio(e.value === undefined ? -1 : e.value);
              }}
              showClear
              options={
                municipiosEstados && municipiosEstados.data
                  ? municipiosEstados.data.map((municipio) => {
                      return {
                        label: municipio.nombre_mun,
                        value: municipio.id_municipio,
                      };
                    })
                  : []
              }
            />
          </FloatLabel>
        </div>
      </div>
      <div className="flex gap-5 p-10 bg-neutral-900 mt-10">
        <div className="w-1/3">
          <h2 className="text-3xl text-center mb-3 font-roboto">
            Estados de Mexico
          </h2>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapaEstados />
          </div>
        </div>
        <div className="w-2/3 flex-col">
          <h2 className="text-3xl text-center mb-3 font-roboto">Municipios</h2>
          {idEstado !== -1 && (
            <div className="h-[240px] rounded-lg overflow-hidden">
              <MapaMunicipios />
            </div>
          )}
          <div className="mt-10">
            <TemperatureChart h={550 - 240} w={"100%"} />
          </div>
        </div>
      </div>
    </main>
  );
};
