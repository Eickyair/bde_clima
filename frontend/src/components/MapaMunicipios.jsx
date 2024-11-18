import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { v4 as uuidv4 } from 'uuid';
import { useMapas } from '../context/Mapas';
import { useApi } from '../hooks/useApi';
import { Skeleton } from 'primereact/skeleton';
import { useGeoJSON } from '../context/GeoJSON';
export const MapaMunicipios = () => {
    const h = 400;
    const [geoData, setGeoData] = useState(null);
    const [center, setCenter] = useState([19.432794095377233, -99.13145749369393]);
    const [bounds, setBounds] = useState(null);
    const VITE_HOST = import.meta.env.VITE_API_HOST;
    const { addGeoJSON, getGeoJSON } = useGeoJSON();
    const { fecha, idEstado, metricaTmp, setIdMunicipio } = useMapas();
    const { data: res, isLoading: isLoadingMunicipios } = useApi('estados/tmps', { fecha: fecha.toISOString(), id_estado: idEstado });
    useEffect(() => {
        const cache = getGeoJSON(idEstado);
        if (cache) {
            setGeoData(cache);
            let centro = turf.centerOfMass(cache);
            setCenter([centro.geometry.coordinates[1], centro.geometry.coordinates[0]]);
            const bbox = turf.bbox(cache);
            setBounds([
                [bbox[1], bbox[0]],
                [bbox[3], bbox[2]]
            ]);
            return;
        }

        fetch(`${VITE_HOST}/municipios/${idEstado}.json`).then(res => res.json())
            .then(data => {
                setGeoData(data);
                let centro = turf.centerOfMass(data);
                setCenter([centro.geometry.coordinates[1], centro.geometry.coordinates[0]]);
                const bbox = turf.bbox(data);
                setBounds([
                    [bbox[1], bbox[0]],
                    [bbox[3], bbox[2]]
                ]);
                addGeoJSON(idEstado, data);
            })
    }, [idEstado])
    const buscarMunicipio = (id_municipio) => {
        const municipio = res.data.find(m => m.id_municipio === id_municipio);
        return municipio;
    }
    const obtenerValor = (municipio) => {
        if (metricaTmp === 'min') {
            return parseFloat(municipio.tmin)
        }
        return parseFloat(municipio.tmax)
    }
    if (isLoadingMunicipios || !res) {
        return <Skeleton width='100%' height={h} />;
    }
    let dataMunicipios = res.data;
    let maximo_tmp = dataMunicipios.reduce((max, municipio) => {
        let tmp = parseFloat(municipio.tmax)
        return tmp > max ? tmp : max;
    }, 0);
    let minimo_tmp = dataMunicipios.reduce((min, municipio) => {
        let tmp = parseFloat(municipio.tmin)
        return tmp < min ? tmp : min;
    }, Infinity);
    const calcularColorCoolWarm = (id_municipio, maximo, minimo) => {
        const estado = buscarMunicipio(id_municipio)
        if (!estado) {
            return '#fff'
        }
        let tmp = obtenerValor(estado)

        let tmp_estandar = (tmp - minimo) / (maximo - minimo)
        if (metricaTmp === 'min') {
            return `rgb(0,0,${255 * tmp_estandar})`
        }
        return `rgb(${255 * tmp_estandar},0,0)`
    }
    const style = (id_municipio) => {
        return {
            fillColor: calcularColorCoolWarm(id_municipio, maximo_tmp, minimo_tmp),
            weight: 2,
            opacity: 0.7,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.6
        };
    };
    return (
        <MapContainer
            center={center}
            zoomControl={false}
            bounds={bounds}
            style={{ height: h, width: '100%' }}
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
            {geoData && geoData.features.map((f, i) => {
                return <GeoJSON key={uuidv4()} style={() => style(f.properties.id_municipio)} data={f} onEachFeature={(feature, layer) => {
                    layer.on({
                        click: () => {
                            setIdMunicipio(feature.properties.id_municipio);
                        }
                    });
                    let municipio = buscarMunicipio(feature.properties.id_municipio);
                    if (!municipio) {
                        return;
                    }
                    let contenido = `<h2>${municipio.nombre}</h2> <br> Máxima: ${municipio.tmax} <br> Mínima: ${municipio.tmin}`
                    layer.bindPopup(contenido);
                }} />
            })}
        </MapContainer>
    );
};