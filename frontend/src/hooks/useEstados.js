import useSWR from 'swr'
import { getEndpoint } from '../utils/getEndpoint'

const fetcher = (...args) => fetch(...args).then(res => res.json())
export const useEstados = (fecha) => {
    const endpoint = getEndpoint()
    const fecha_yyyymmdd = fecha.toISOString().slice(0, 10)
    const { data, error, isLoading,isValidating,mutate } = useSWR(`${endpoint}/estados?fecha=${fecha_yyyymmdd}`, fetcher)
    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    }
}