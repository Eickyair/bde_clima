// src/components/MapaEstados.tsx
import React from 'react';
import estadosData from '../data/estados.json';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useMapas } from '../context/Mapas';
import { EstadosGeoJSON, EstadoProperties } from '../types/GeoJSONTypes';
import L, { LeafletEvent } from 'leaflet';

// Asegúrate de que estadosData está correctamente tipado
const estados: EstadosGeoJSON = estadosData as EstadosGeoJSON;

export const MapaEstados: React.FC = () => {
    const { setIdEstado, setCentrosEstados, centrosEstados } = useMapas();

    // Función para generar un color aleatorio
    const getRandomColor = (): string => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Función para definir el estilo de cada feature
    const style = (): L.PathOptions => ({
        fillColor: getRandomColor(),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    });

    // Función para manejar eventos en cada feature
    const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, EstadoProperties>, layer: L.Layer): void => {
        const geoJsonLayer = layer as L.GeoJSON;
        geoJsonLayer.on({
            click: (event: LeafletEvent) => {
                setIdEstado(feature.properties.id_estado);
                // Si necesitas actualizar centrosEstados, puedes hacerlo aquí
                // Por ejemplo:
                // setCentrosEstados(nuevoValor);
            }
        });
    };

    return (
        <div style={{ width: "800px", height: "800px" }}>
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
                    estados.features.map((feature, index) => (
                        <GeoJSON
                            key={index}
                            data={feature}
                            onEachFeature={onEachFeature}
                            style={style}
                        />
                    ))
                }
            </MapContainer>
        </div>
    );
};

export default MapaEstados;
