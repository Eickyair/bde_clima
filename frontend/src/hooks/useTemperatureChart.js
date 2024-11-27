import useSWR from "swr";
import { getEndpoint } from "../utils/getEndpoint";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useTemperatureChart = (idEstado, idMunicipio, fecha) => {
  const endpoint = getEndpoint();
  const fecha_yyyymmdd = fecha.toISOString().slice(0, 10);
  const { data, error, isLoading, isValidating } = useSWR(
    idEstado !== -1 && idMunicipio !== -1
      ? `${endpoint}/municipios/${idEstado}/${idMunicipio}?fecha=${fecha_yyyymmdd}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  return {
    data,
    isLoading,
    isError: error,
    isValidating,
  };
};
