import useSWR, { mutate } from "swr";
import { getDetailVehicleApi, getListVehicleApi } from "../api/vehicle.api";
import { swrOptions } from "./config.swr";

export function getListVehicleSwr(param) {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/vehicle?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `category=${param?.category ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListVehicleApi(param), 
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

export function getDetailVehicleSwr(id) {
  const fetcher = async () => getDetailVehicleApi(id)
  const { data, mutate, error } = useSWR(`/vehicle/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}