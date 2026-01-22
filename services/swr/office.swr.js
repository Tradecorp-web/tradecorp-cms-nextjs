import useSWR from "swr";
import { getListMasterOffice, getListMasterPermissionTemp } from "../api/office.api";
import { swrOptions } from "./config.swr";

export function masterOfficeSwr(param) {
  var url = `/office?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `company=${param?.company ?? ""}&`
  const { data, mutate, error } = useSWR(
    url, 
    () => getListMasterOffice(param), 
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

export function masterPermissionTempSwr() {
  const { data, mutate, error } = useSWR(
    `/master/permission-temp`, 
    () => getListMasterPermissionTemp(), 
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