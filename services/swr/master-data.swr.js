import useSWR from "swr";
import { getListMasterData, getMasteData, getMasterDataApi } from "../api/master-data.api";
import { swrOptions } from "./config.swr";

export const masterDataCategory = {
  termOfPayment: "term_of_payment",
  stockStatus: "stock_status",
  condition: "condition",
  statusRepair: "status_repair",
  containerSize: "container_size",
  containerType: "container_type",
  submissionStatus: "submission_status",
  team: "team",
};

export function masterDataSwr(category = "", order = "") {
  const { data, mutate, error } = useSWR(
    `/master/categories?category=${category}&orderBy=${order}`,
    () => getMasteData(category, order),
    swrOptions
  );
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}

export function getMasterDataSwr(param) {
  var search = param?.search ?? ""
  var page = param?.page ?? 1
  var limit = param?.limit ?? 20
  const { data, mutate, error } = useSWR(
    `/master/list?search=${search}&page=${page}&limit=${limit}&orderBy=&order=`,
    async () => getMasterDataApi(search, page, limit), 
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
