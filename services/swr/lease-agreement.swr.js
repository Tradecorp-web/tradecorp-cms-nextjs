import useSWR, { mutate } from "swr";
import { getDetailLeaseAgreementApi, getListLeaseAgreementApi } from "../api/lease-agreement.api";
import { swrOptions } from "./config.swr";

export function getListLeaseAgreementSwr(param) {
  var url = `/lease-agreement?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `depoId=${param?.depoId ?? ""}&`
  url += `status=${param?.status ?? ""}&`
  url += `createdBy=${param?.createdBy ?? ""}&`
  const { data, mutate, error } = useSWR(
    url,
    async () => getListLeaseAgreementApi(param), 
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

export function getDetailLeaseAgreementSwr(id) {
  const fetcher = async () => getDetailLeaseAgreementApi(id)
  const { data, mutate, error } = useSWR(`/lease-agreement/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}