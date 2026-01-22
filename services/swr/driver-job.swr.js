import useSWR, { mutate } from "swr";
import { getDetailDriverJobApi, getListDriverJobApi } from "../api/driver-job.api";
import { swrOptions } from "./config.swr";

export function getListDriverJobSwr(param) {
  var url = `/driver-job?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `driverId=${param?.driverId ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListDriverJobApi(param), 
    swrOptions
  )
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}

export function getDetailDriverJobSwr(id) {
  const fetcher = async () => getDetailDriverJobApi(id)
  const { data, mutate, error } = useSWR(`/driver-job/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}