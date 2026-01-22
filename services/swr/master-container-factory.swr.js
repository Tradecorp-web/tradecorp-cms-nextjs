import useSWR from "swr";
import {
  getListMasterContainerFactoryApi,
  getListQuoteInGroupFactoryApi,
} from "../api/master-container-factory.api";
import { swrOptions } from "./config.swr";

export function getMasterContainerFactorySwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 0;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/master/quote-in-group-factory?search=${search}&page=${page}&limit=${limit}&orderBy=&order=`,
    async () => getListQuoteInGroupFactoryApi(search, page, limit),
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
