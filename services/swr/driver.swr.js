import useSWR, { mutate } from "swr";
import { getDetailDriverApi, getListDriverApi, getLocationDriverApi } from "../api/driver.api";
import { swrOptions } from "./config.swr";

export function getListDriverSwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/driver?search=${search}&page=${page}&limit=${limit}&category=${param?.category ?? ""}`,
    async () => getListDriverApi(param), 
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

export function getDetailDriverSwr(id) {
  const fetcher = async () => getDetailDriverApi(id)
  const { data, mutate, error } = useSWR(`/driver/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}

export function getLocationDriverSwr(id) {
  const fetcher = async () => getLocationDriverApi(id)
  const { data, mutate, error } = useSWR(`/driver/loc/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}