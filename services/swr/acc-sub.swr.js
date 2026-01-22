import useSWR, { mutate } from "swr";
import {
  getListSubAccApi,
  getDetailSubAccApi,
  getListSubAccStatusApi,
} from "../api/acc-sub.api";
import { swrOptions } from "./config.swr";

export function getListSubAccSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    `/sub-acc?search=${search}&page=${page}&limit=${limit}`,
    async () => getListSubAccApi(param),
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

export function getListSubAccStatusSwr(status, param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    `/sub-acc-status/${status}?search=${search}&page=${page}&limit=${limit}`,
    async () => getListSubAccStatusApi(status, param),
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
export function getDetailSubAccSwr(id) {
  const fetcher = async () => getDetailSubAccApi(id);
  const { data, mutate, error } = useSWR(`/sub-acc/${id}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}
