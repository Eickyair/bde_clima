import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useApi } from '../hooks/useApi';
import { useMapas } from '../context/Mapas';
import { Skeleton } from 'primereact/skeleton';
const SerieTemporalMunicipio = () => {
    const { idEstado, fecha, id_municipio } = useMapas();
    const { data: res, isLoading: isLoadingMunicipios } = useApi('mapas/municipios/tmp', { fecha: fecha.toISOString(), id_municipio, id_estado: idEstado });
    // if(true)  return <Skeleton width='100%' height='100%' />

    if (id_municipio === -1) {
        return <Skeleton width='100%' height='100%' />
    }
    if (isLoadingMunicipios || !res) {
        return <Skeleton width='100%' height='100%' />
    }
    return < Chart className='h-[200px]' type="line" data={{
        labels: res.data.map(d => d.fecha),
        datasets: [
            {
                label: 'Temperatura Máxima',
                data: res.data.map(d => d.tmax),
                fill: false,
                borderColor: '#4bc0c0'
            },
            {
                label: 'Temperatura Mínima',
                data: res.data.map(d => d.tmin),
                fill: false,
                borderColor: '#ff6384'
            }
        ]
    }} />
};

export default SerieTemporalMunicipio;