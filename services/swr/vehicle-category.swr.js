import useSWR from "swr";
import { getListVehicleCategoryApi, getDetailVehicleCategoryApi } from "../api/vehicle-category.api";
import { swrOptions } from "./config.swr";

export function getListVehicleCategorySwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/vehicle-category?search=${search}&page=${page}&limit=${limit}&`, 
    async () => getListVehicleCategoryApi(param), 
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

export function getDetailVehicleCategorySwr(id) {
  const fetcher = async () => getDetailVehicleCategoryApi(id)
  const { data, mutate, error } = useSWR(`/vehicle-category/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error

  return {
    isLoading,
    data,
    error,
    mutate
  };
}