import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { useMapas } from '../context/Mapas';
import { useApi } from '../hooks/useApi';
import { Skeleton } from 'primereact/skeleton';
export const MapaMunicipios = ({ geoJsonPath }) => {
    const h = 400;
    const [geoData, setGeoData] = useState(null);
    const [center, setCenter] = useState([19.432794095377233, -99.13145749369393]);
    const [bounds, setBounds] = useState(null);
    const { fecha, idEstado, metricaTmp,setIdMunicipio } = useMapas();
    const { data: res, isLoading: isLoadingMunicipios } = useApi('estados/tmps', { fecha: fecha.toISOString(), id_estado: idEstado });
    useEffect(() => {
        import(/* @vite-ignore */ geoJsonPath)
            .then(module => {
                const data = module.default;
                setGeoData(data);
                let centro = turf.centerOfMass(data);

                setCenter([centro.geometry.coordinates[1], centro.geometry.coordinates[0]]);
                const bbox = turf.bbox(data);
                setBounds([
                    [bbox[1], bbox[0]],
                    [bbox[3], bbox[2]]
                ]);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }, [geoJsonPath]);
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
        if(metricaTmp === 'min'){
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
                key={geoData ? geoData.features.length : 'loading'}
                center={center}
                bounds={bounds}
                style={{ height: h , width: '100%' }}
            >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
                {geoData && geoData.features.map((f, i) => {
                    return <GeoJSON style={() => style(f.properties.id_municipio)} key={i} data={f} onEachFeature={(feature, layer) => {
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