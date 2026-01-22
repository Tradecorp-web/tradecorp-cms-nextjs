import useSWR, { mutate } from "swr";
import { getListAccPoData, getListAccPoDataApi } from "../api/acc-po-data.api";
import { swrOptions } from "./config.swr";

export function accPoDataSwr(date1, date2) {
  const { data, mutate, error } = useSWR(
    `/acc-po-date/${date1}/${date2}`,
    () => getListAccPoData(date1, date2),
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

export function getListAccPoSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    `/acc-po?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListAccPoDataApi(param),
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

export function getDetailAccPoSwr(date1, date2) {
  const fetcher = async () => getListAccPoData(date1, date2);
  const { data, mutate, error } = useSWR(
    `/acc-po-date/${date1}/${date2}`,
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
