import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMapas } from '../context/Mapas';
import { Skeleton } from 'primereact/skeleton';
import { useMunicipiosEstado } from '../hooks/useMunicipiosEstado';
import { useGeoJSON } from '../hooks/useGeoJSon';
const obtenerValor = (municipio, metricaTmp) => {
    if (metricaTmp === 'min') {
        return parseFloat(municipio.tmin)
    }
    return parseFloat(municipio.tmax)
}
const obtenerMetricas = (municipio) => {
    return {
        tmax: parseFloat(municipio.tmax),
        tmin: parseFloat(municipio.tmin)
    }
}

const obtenerMunicipio = (id_municipio, dataMunicipios) => {
    return dataMunicipios.find(municipio => municipio.id_municipio === id_municipio)
}
const calcularColorCoolWarm = (id_municipio, maximo, minimo, metricaTmp, dataMunicipios) => {
    const municipio = obtenerMunicipio(id_municipio, dataMunicipios);
    if (!municipio) {
        return '#FFFFFF'; // Blanco si no se encuentra el municipio
    }

    // Obtener el valor de la métrica (tmax o tmin)
    let tmp = obtenerValor(municipio, metricaTmp);

    // Normalizar el valor de temperatura entre 0 y 1
    let tmp_estandar = (tmp - minimo) / (maximo - minimo);
    tmp_estandar = Math.min(Math.max(tmp_estandar, 0), 1); // Clamp entre 0 y 1

    // Calcular el matiz (Hue) de 240 (azul) a 0 (rojo)
    let hue = 240 - (240 * tmp_estandar);

    // Retornar el color en formato HSL
    return `hsl(${hue}, 100%, 50%)`;
};
const style = (id_estado, maximo, minimo, metricaTmp, dataMunicipios) => {
    return {
        fillColor: calcularColorCoolWarm(id_estado, maximo, minimo, metricaTmp, dataMunicipios),
        weight: 2,
        opacity: 0.7,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };
};
export const MapaMunicipios = () => {
    const h = '100%';
    const { fecha, idEstado, metricaTmp, setIdMunicipio } = useMapas();
    const [wait, setWait] = useState(true);
    const { data } = useMunicipiosEstado(fecha, idEstado);
    const { data: jsonMapa, mapView, updatingMapView, isLoading } = useGeoJSON(idEstado);
    useEffect(() => {
        setWait(false);
    }, [mapView]);
    useEffect(() => {
        setWait(true);
    }, [idEstado])
    if (!jsonMapa || !data || updatingMapView) {
        return <Skeleton width='100%' height={h} />;
    }

    if (!wait && jsonMapa && mapView.bounds && mapView.center && data) {
        console.log("🚀 ~ MapaMunicipios ~ data:", data)
        const mapaMunicipios = new Map()
        data.data.forEach(municipio => {
            mapaMunicipios.set(municipio.id_municipio, municipio)
        })
        
        return <div className='w-full h-full'>
            <MapContainer
                center={mapView.center}
                zoomControl={false}
                key={idEstado}
                bounds={mapView.bounds}
                style={{ height: h, width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
                {jsonMapa && jsonMapa.features.map((f) => {
                    if(!mapaMunicipios.has(f.properties.id_municipio)){
                        return <></>;
                    }
                    return (
                        <GeoJSON
                            key={`${idEstado}-${f.properties.id_municipio}`}
                            style={() => style(f.properties.id_municipio, data.maxTmp, data.minTmp, metricaTmp, data.data)}
                            data={f}
                            onEachFeature={(feature, layer) => {
                                layer.on({
                                    click: () => {
                                        setIdMunicipio(feature.properties.id_municipio);
                                    }
                                });
                                let municipio = obtenerMunicipio(feature.properties.id_municipio, data.data);
                                if (!municipio) {
                                    return;
                                }
                                let contenido = `<h2>${municipio.nombre}</h2> <br> Máxima: ${municipio.tmax} <br> Mínima: ${municipio.tmin}`;
                                layer.bindPopup(contenido);
                            }}
                        />
                    )
                })}
            </MapContainer>
        </div>
    }
};
