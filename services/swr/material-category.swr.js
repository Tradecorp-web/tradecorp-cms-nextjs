import useSWR from "swr";
import { getListMaterialCategoryApi, getDetailMaterialCategoryApi } from "../api/material-category.api";
import { swrOptions } from "./config.swr";

export function getListMaterialCategorySwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/material-category?search=${search}&page=${page}&limit=${limit}&`, 
    async () => getListMaterialCategoryApi(param), 
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

export function getDetailMaterialCategorySwr(id) {
  const fetcher = async () => getDetailMaterialCategoryApi(id)
  const { data, mutate, error } = useSWR(`/material-category/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error

  return {
    isLoading,
    data,
    error,
    mutate
  };
}