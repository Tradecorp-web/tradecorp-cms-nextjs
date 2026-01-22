import useSWR, { mutate } from "swr";
import { getDetailOneWayApi, getListOneWayApi } from "../api/one-way.api";
import { swrOptions } from "./config.swr";

export function getListOneWaySwr(param) {
  var url = `/one-way?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `depoId=${param?.depoId ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListOneWayApi(param), 
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

export function getDetailOneWaySwr(id) {
  const fetcher = async () => getDetailOneWayApi(id)
  const { data, mutate, error } = useSWR(`/one-way/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}