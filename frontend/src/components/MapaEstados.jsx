'use client'
import estados from '../data/estados.json'
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useMapas } from '../context/Mapas';
import { useApi } from '../hooks/useApi';
import { Skeleton } from 'primereact/skeleton';

export const MapaEstados = () => {
    const { setIdEstado, fecha ,metricaTmp} = useMapas();
    const { data: res, isLoading: isLoadingMunicipios } = useApi('mapas/estados', { fecha: fecha.toISOString() })
    const w = 600
    const h = 600
    if (isLoadingMunicipios || !res) {
        return <Skeleton width={w} height={h} />
    }
    if (res.noInfo) {
        return <div>No hay datos</div>
    }
    const obtenerValor = (estado) => {
        if (metricaTmp === 'min') {
            return parseFloat(estado.promedio_minimas_tmp)
        }
        return parseFloat(estado.promedio_maximas_tmp)
    }
    let dataMunicipios = res.data
    let maximo = dataMunicipios.reduce((max, estado) => {
        let tmp = obtenerValor(estado)
        return tmp > max ? tmp : max
    }, 0)
    let minimo = dataMunicipios.reduce((min, estado) => {
        let tmp = obtenerValor(estado)
        return tmp < min ? tmp : min
    }, Infinity)
    const obtenerEstado = (id_estado) => {
        return dataMunicipios.find(estado => estado.id_estado === id_estado)
    }
    const calcularColorCoolWarm = (id_estado, maximo, minimo) => {
        const estado = obtenerEstado(id_estado)
        if (!estado) {
            return '#fff'
        }
        let tmp = obtenerValor(estado)

        let tmp_estandar = (tmp - minimo) / (maximo - minimo)
        if(metricaTmp === 'min'){
            return `rgb(0,0,${255 * tmp_estandar})`
        }
        return `rgb(${255 * tmp_estandar},0,0)`
    }
    const style = (id_estado) => {
        return {
            fillColor: calcularColorCoolWarm(id_estado, maximo, minimo),
            weight: 2,
            opacity: 0.7,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.6
        };
    };
    const onEachFeature = (feature, layer) => {
        if (feature.properties.id_estado) {
            const estado = obtenerEstado(feature.properties.id_estado)
            const tmp_m = estado.promedio_maximas_tmp.toFixed(2)
            const tmp_n = estado.promedio_minimas_tmp.toFixed(2)
            let contenido = `<h2>${estado.nombre_est}</h2> <br> Máxima: ${tmp_m} <br> Mínima: ${tmp_n}`
            layer.bindPopup(contenido);
        }
        layer.on({
            click: () => {
                setIdEstado(feature.properties.id_estado);
            }
        });
    };
    return <div>
        <div style={{ width: `${w}px`, height: `${h}px`, borderRadius:'10px', overflow:'hidden' }}>
            <MapContainer
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    top: 0
                }}
                center={[19.432794095377233, -99.13145749369393]}
                zoom={5}
            >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
                {
                    estados.features.map((feature, index) => {
                        return <GeoJSON key={index} data={feature} onEachFeature={onEachFeature} style={() => style(feature.properties.id_estado)} />;
                    })
                }
            </MapContainer>
        </div>
    </div>
}
