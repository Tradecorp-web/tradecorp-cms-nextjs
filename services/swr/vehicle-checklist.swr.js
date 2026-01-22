import useSWR, { mutate } from "swr";
import { getDetailVehicleChecklistApi, getListVehicleChecklistApi } from "../api/vehicle-checklist.api";
import { swrOptions } from "./config.swr";

export function getListVehicleChecklistSwr(param) {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/vehicle-checklist-template?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListVehicleChecklistApi(param), 
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

export function getDetailVehicleChecklistSwr(id) {
  const fetcher = async () => getDetailVehicleChecklistApi(id)
  const { data, mutate, error } = useSWR(`/vehicle-checklist-template/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}