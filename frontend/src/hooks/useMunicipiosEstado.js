import useSWR from "swr";
import { getEndpoint } from "../utils/getEndpoint";
const fetcher = (...args) => fetch(...args).then(res => res.json());
export const useMunicipiosEstado = (fecha, idEstado) => {
    const endpoint = getEndpoint();
    const fecha_yyyymmdd = fecha.toISOString().slice(0, 10);
    const { data, error, isLoading, isValidating, mutate } = useSWR(`${endpoint}/v1/municipios/${idEstado}?fecha=${fecha_yyyymmdd}`, fetcher);
    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
}