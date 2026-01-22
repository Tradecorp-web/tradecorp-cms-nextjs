import useSWR from "swr";
import { getListProductCategoryApi, getDetailProductCategoryApi } from "../api/product-category.api";
import { swrOptions } from "./config.swr";

export function getListProductCategorySwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/product-category?search=${search}&page=${page}&limit=${limit}&`, 
    async () => getListProductCategoryApi(param), 
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

export function getDetailProductCategorySwr(id) {
  const fetcher = async () => getDetailProductCategoryApi(id)
  const { data, mutate, error } = useSWR(`/product-category/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error

  return {
    isLoading,
    data,
    error,
    mutate
  };
}