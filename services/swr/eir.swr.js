import useSWR, { mutate } from "swr";
import { getDetailEirApi, getListEirApi } from "../api/eir.api";
import { swrOptions } from "./config.swr";

export function getListEirSwr(param) {
  var url = `/eir?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `depoId=${param?.depoId ?? ""}&`
  url += `movement=${param?.movement ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListEirApi(param), 
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

export function getDetailEirSwr(id) {
  const fetcher = async () => getDetailEirApi(id)
  const { data, mutate, error } = useSWR(`/eir/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}