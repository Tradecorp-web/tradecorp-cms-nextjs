import useSWR, { mutate } from "swr";
import { getDetailDOAcceptanceApi, getListDOAcceptanceApi } from "../api/do-acceptance.api";
import { swrOptions } from "./config.swr";

export function getListDOAcceptanceSwr(param) {
  var url = `/do-acceptance?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `depoId=${param?.depoId ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListDOAcceptanceApi(param), 
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

export function getDetailDOAcceptanceSwr(id) {
  const fetcher = async () => getDetailDOAcceptanceApi(id)
  const { data, mutate, error } = useSWR(`/do-acceptance/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}