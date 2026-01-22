import useSWR, { mutate } from "swr";
import { getDetailMailGroupApi, getListMailGroupApi } from "../api/mail-group.api";
import { swrOptions } from "./config.swr";

export function getListMailGroupSwr(param) {
  var url = `/mail-groups?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `depoId=${param?.depoId ?? ""}&`
  url += `createdBy=${param?.createdBy ?? ""}&`
  url += `company=${param?.company ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListMailGroupApi(param), 
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

export function getDetailMailGroupSwr(id) {
  const fetcher = async () => getDetailMailGroupApi(id)
  const { data, mutate, error } = useSWR(`/mail-groups/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}