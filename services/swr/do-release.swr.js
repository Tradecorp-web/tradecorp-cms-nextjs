import useSWR, { mutate } from "swr";
import { getDetailDOReleaseApi, getListDOReleaseApi } from "../api/do-release.api";
import { swrOptions } from "./config.swr";

export function getListDOReleaseSwr(param) {
  var url = `/do-release?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `depoId=${param?.depoId ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListDOReleaseApi(param), 
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

export function getDetailDOReleaseSwr(id) {
  const fetcher = async () => getDetailDOReleaseApi(id)
  const { data, mutate, error } = useSWR(`/do-release/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}