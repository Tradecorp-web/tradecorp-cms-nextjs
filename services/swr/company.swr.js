import useSWR, { mutate } from "swr";
import { getDetailCompanyOfficeApi, getListCompanyOfficeApi, getDetailCompanyApi, getListCompanyApi } from "../api/company.api";
import { swrOptions } from "./config.swr";

export function getListCompanyOfficeSwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/office?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListCompanyOfficeApi(param), 
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

export function getDetailCompanyOfficeSwr(id) {
  const fetcher = async () => getDetailCompanyOfficeApi(id)
  const { data, mutate, error } = useSWR(`/office/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error

  return {
    isLoading,
    data,
    error,
    mutate
  };
}

export function getListCompanySwr(param) {
  var url = `/company?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListCompanyApi(param), 
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

export function getDetailCompanySwr(id) {
  const fetcher = async () => getDetailCompanyApi(id)
  const { data, mutate, error } = useSWR(`/company/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error

  return {
    isLoading,
    data,
    error,
    mutate
  };
}
  