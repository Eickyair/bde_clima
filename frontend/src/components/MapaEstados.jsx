import estados from '../data/estados.json'
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useMapas } from '../context/Mapas';
import { Skeleton } from 'primereact/skeleton';
import { useEstados } from '../hooks/useEstados';
const obtenerValor = (estado, metricaTmp) => {
    if (metricaTmp === 'min') {
        return parseFloat(estado.tmin)
    }
    return parseFloat(estado.tmax)
}
const obtenerMetricas = (estado) => {
    return {
        tmax: parseFloat(estado.tmax),
        tmin: parseFloat(estado.tmin)
    }
}

const obtenerEstado = (id_estado, dataEstados) => {
    return dataEstados.find(estado => estado.id_estado === id_estado)
}
const calcularColorCoolWarm = (id_estado, maximo, minimo, metricaTmp, dataEstados) => {
    const estado = obtenerEstado(id_estado, dataEstados)
    if (!estado) {
        return '#fff'
    }
    let tmp = obtenerValor(estado, metricaTmp)

    let tmp_estandar = (tmp - minimo) / (maximo - minimo)
    if (metricaTmp === 'min') {
        return `rgb(0,0,${255 * tmp_estandar})`
    }
    return `rgb(${255 * tmp_estandar},0,0)`
}
const style = (id_estado, maximo, minimo, metricaTmp, dataEstados) => {
    return {
        fillColor: calcularColorCoolWarm(id_estado, maximo, minimo, metricaTmp, dataEstados),
        weight: 2,
        opacity: 0.7,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };
};
export const MapaEstados = () => {
    const { setIdEstado, fecha, metricaTmp, setIdMunicipio } = useMapas();
    const { data: metricasEstados, isLoading: isLoadingEstados, error } = useEstados(fecha)
    const w = 600
    const h = 600
    const onEachFeature = (feature, layer, dataEstados) => {
        if (feature.properties.id_estado) {
            const estado = obtenerEstado(feature.properties.id_estado, dataEstados)
            const { tmax, tmin } = obtenerMetricas(estado)
            let contenido = `<h2>${estado.nombre_est}</h2> <br> Máxima: ${tmax} <br> Mínima: ${tmin}`
            layer.bindPopup(contenido);
        }
        layer.on({
            click: () => {
                setIdEstado(feature.properties.id_estado);
                setIdMunicipio(-1)
            }
        });
    };
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error.message}</span>
                <div className="mt-4">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => alert(error.message)}
                    >
                        Mostrar Error
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }
    if (isLoadingEstados || !metricasEstados || !estados) {
        return <Skeleton width={w} height={h} />
    }
    if (metricasEstados.data.length === 0) {
        return <div>No hay datos</div>
    }
    const { maxTmp, minTmp } = metricasEstados
    if (metricaTmp === 'min') {
        return (
            <div>
                <h1 className='font-normal text-2xl text-center font-roboto'>
                    Mapa de estados
                </h1>
                <div style={{ width: `${w}px`, height: `${h}px`, borderRadius: '10px', overflow: 'hidden' }} className='shadow-xl'>
                    <MapContainer
                        style={{
                            width: "100%",
                            height: "100%",
                            zIndex: 10,
                            top: 0
                        }}
                        center={[19.432794095377233, -99.13145749369393]}
                        zoomControl={false}
                        zoomAnimation={true}
                        zoom={5}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
                        {
                            estados.features.map((feature, i) => {
                                return <GeoJSON key={i} data={feature} onEachFeature={(f, l) => onEachFeature(f, l, metricasEstados.data)} style={() => style(feature.properties.id_estado, maxTmp, minTmp, metricaTmp, metricasEstados.data)} />;
                            })
                        }
                    </MapContainer>
                </div>
            </div>)
    } else if (metricaTmp === 'max') {
        return (
            <div>
                <h1 className='font-normal text-2xl text-center font-roboto'>
                    Mapa de estados
                </h1>
                <div style={{ width: `${w}px`, height: `${h}px`, borderRadius: '10px', overflow: 'hidden' }} className='shadow-xl'>
                    <MapContainer
                        style={{
                            width: "100%",
                            height: "100%",
                            zIndex: 10,
                            top: 0
                        }}
                        center={[19.432794095377233, -99.13145749369393]}
                        zoomControl={false}
                        zoomAnimation={true}
                        zoom={5}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
                        {
                            estados.features.map((feature, i) => {
                                return <GeoJSON key={i} data={feature} onEachFeature={(f, l) => onEachFeature(f, l, metricasEstados.data)} style={() => style(feature.properties.id_estado, maxTmp, minTmp, metricaTmp, metricasEstados.data)} />;
                            })
                        }
                    </MapContainer>
                </div>
            </div>)
    }
}
