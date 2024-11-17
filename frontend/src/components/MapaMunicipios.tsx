// src/components/MapaMunicipios.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';
import { MunicipioGeoJSON } from '../types/GeoJSONTypes';
import L from 'leaflet';

interface MapaMunicipiosProps {
    geoJsonPath: string;
    centro: [number, number]; // [latitude, longitude]
}

export const MapaMunicipios: React.FC<MapaMunicipiosProps> = ({ geoJsonPath, centro }) => {
    const [geoData, setGeoData] = useState<MunicipioGeoJSON | null>(null);
    const [center, setCenter] = useState<[number, number]>(centro);
    const [bounds, setBounds] = useState<L.LatLngBoundsExpression | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Función asíncrona para cargar el GeoJSON
        const fetchGeoJSON = async () => {
            setLoading(true);
            try {
                const response = await fetch(geoJsonPath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: MunicipioGeoJSON = await response.json();

                setGeoData(data);

                // Calcula el centro de masa utilizando Turf
                const centroGeo = turf.centerOfMass(data);
                setCenter([centroGeo.geometry.coordinates[1], centroGeo.geometry.coordinates[0]]);

                // Calcula los límites (bounding box) utilizando Turf
                const bbox = turf.bbox(data);
                setBounds([
                    [bbox[1], bbox[0]],
                    [bbox[3], bbox[2]]
                ]);

                setError(null);
            } catch (error: any) {
                console.error('Error loading GeoJSON:', error);
                setError('No se pudo cargar el archivo GeoJSON.');
            } finally {
                setLoading(false);
            }
        };

        fetchGeoJSON();
    }, [geoJsonPath]);

    if (loading) {
        return <p>Cargando mapa...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <MapContainer
            key={geoData ? geoData.features.length : 'loading'}
            center={center}
            bounds={bounds ?? undefined}
            style={{ height: '90vh', width: '50%' }}
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
            {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
    );
};

export default MapaMunicipios;
