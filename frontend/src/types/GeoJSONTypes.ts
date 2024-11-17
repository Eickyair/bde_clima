// src/types/GeoJSONTypes.ts
import { GeoJsonProperties, FeatureCollection, Geometry } from 'geojson';

// Define la interfaz para las propiedades de cada feature si es necesario
export interface EstadoProperties {
    [name: string]: any;
    id_estado: number;
    // Agrega otras propiedades específicas si las hay
}

// Define el tipo para el archivo estados.json
export type EstadosGeoJSON = FeatureCollection<GeoJSON.Geometry, EstadoProperties>;

export interface MunicipioProperties {
    // Define las propiedades específicas si las hay
    // Por ejemplo:
    id_municipio: number;
    nombre: string;
    // Agrega otras propiedades según tu GeoJSON
}

export type MunicipioGeoJSON = FeatureCollection<Geometry, MunicipioProperties>;