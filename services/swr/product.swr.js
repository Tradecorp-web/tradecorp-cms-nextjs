import useSWR, { mutate } from "swr";
import { getDetailProductApi, getListProductApi } from "../api/product.api";
import { swrOptions } from "./config.swr";

export function getListProductSwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/product?search=${search}&page=${page}&limit=${limit}&category=${param?.category ?? ""}&vendor=${param?.vendor ?? ""}`,
    async () => getListProductApi(param), 
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

export function getDetailProductSwr(id) {
  const fetcher = async () => getDetailProductApi(id)
  const { data, mutate, error } = useSWR(`/product/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}