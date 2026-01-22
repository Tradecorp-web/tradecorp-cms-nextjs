import useSWR, { mutate } from "swr";
import { getListQuoteApi, getQuoteStatusAccApi } from "../api/quote.api";
import { swrOptions } from "./config.swr";

export function getListQuoteSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    // `/quote?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    `/quote`,
    async () => getListQuoteApi(),
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

export function getListQuoteStatusAccSwr(statusAcc) {
  const { data, mutate, error } = useSWR(
    `/quote-status/${statusAcc}`,
    async () => getQuoteStatusAccApi(statusAcc),
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
