import useSWR from "swr";
import { getEndpoint } from "../utils/getEndpoint";
const fetcher = (...args) => fetch(...args).then((res) => res.json());
export const useGetMunicipios = (idEstado) => {
  const endpoint = getEndpoint();
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    idEstado !== -1 ? `${endpoint}/estados/${idEstado}` : null,
    fetcher
  );
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
