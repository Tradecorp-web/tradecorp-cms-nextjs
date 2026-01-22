import useSWR, { mutate } from "swr";
import { getDetailVendorApi, getListVendorApi } from "../api/vendor.api";
import { swrOptions } from "./config.swr";

export function getListVendorSwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/vendor?search=${search}&page=${page}&limit=${limit}&isAccepted=${param?.isAccepted ?? ""}&pendingAcceptance=${param?.pendingAcceptance ?? ""}&`, 
    async () => getListVendorApi(param), 
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

export function getDetailVendorSwr(id) {
  const fetcher = async () => getDetailVendorApi(id)
  const { data, mutate, error } = useSWR(`/vendor/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error

  return {
    isLoading,
    data,
    error,
    mutate
  };
}
  