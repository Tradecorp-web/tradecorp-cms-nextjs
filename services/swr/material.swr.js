import useSWR, { mutate } from "swr";
import { getDetailMaterialApi, getListMaterialApi, getListMaterialStockHistoriesApi } from "../api/material.api";
import { swrOptions } from "./config.swr";

export function getListMaterialSwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  var underMinimumStock = param?.underMinimumStock ?? false
  var priceExpired = param?.priceExpired ?? false
  const { data, mutate, error } = useSWR(
    `/material?search=${search}&page=${page}&limit=${limit}&category=${param?.category ?? ""}&vendor=${param?.vendor ?? ""}&underMinimumStock=${underMinimumStock}&priceExpired=${priceExpired}&`,
    async () => getListMaterialApi(param), 
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

export function getDetailMaterialSwr(id) {
  const fetcher = async () => getDetailMaterialApi(id)
  const { data, mutate, error } = useSWR(`/material/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}

export function getListMaterialStockHistorySwr(param, id) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/material/${id}/stock-histories?search=${search}&page=${page}&limit=${limit}&category=${param?.category ?? ""}&`,
    async () => getListMaterialStockHistoriesApi(param, id),
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