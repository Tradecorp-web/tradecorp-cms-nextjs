import useSWR from "swr";
import {
  getListQuoteInGroupFactoryApi,
  getListQuoteInApi,
  getDetailQuoteInApi,
} from "../api/quote-in.api";
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
export function getQuoteInSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 0;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/quote-in?search=${search}&page=${page}&limit=${limit}&orderBy=&order=`,
    async () => getListQuoteInApi(search, page, limit),
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

export function getDetailQuoteInSwr(id) {
  const fetcher = async () => getDetailQuoteInApi(id);
  const { data, mutate, error } = useSWR(
    `/quote-in/${id}`,
    fetcher,
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
