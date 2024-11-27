import { useState, useEffect } from "react";
import useSWRImmutable from "swr/immutable";
import * as turf from "@turf/turf";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useGeoJSON = (idEstado) => {
  const [mapView, setMapView] = useState({
    center: [19.432794095377233, -99.13145749369393],
    bounds: null,
  });
  const [updatingMapView, setUpdatingMapView] = useState(false);
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(
    `/municipios/${idEstado}.json`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnMount: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      setUpdatingMapView(true);
      // Utiliza una función asíncrona para manejar los cálculos
      const computeMapView = async () => {
        try {
          // Calcula el centro de masa
          const centerOfMass = turf.centerOfMass(data).geometry.coordinates;
          const center = [centerOfMass[1], centerOfMass[0]];

          // Calcula el bounding box
          const bbox = turf.bbox(data);
          const bounds = [
            [bbox[1], bbox[0]],
            [bbox[3], bbox[2]],
          ];

          // Actualiza el estado del mapa
          setMapView({ center, bounds });
        } catch (err) {
          console.error("Error al calcular el mapa:", err);
        } finally {
          setUpdatingMapView(false);
        }
      };
      computeMapView();
    }
  }, [data]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    updatingMapView,
    mapView,
  };
};
