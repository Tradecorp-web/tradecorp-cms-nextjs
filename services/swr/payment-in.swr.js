import useSWR, { mutate } from "swr";
import {
  getListPaymentInApi,
  getDetailPaymentInApi,
} from "../api/payment-in.api";
import { swrOptions } from "./config.swr";

export function getListPaymentInSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/payment-in?search=${search}&page=${page}&limit=${limit}&`,
    async () => getListPaymentInApi(param),
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

export function getDetailPaymentInSwr(id) {
  const fetcher = async () => getDetailPaymentInApi(id);
  const { data, mutate, error } = useSWR(
    `/payment-in/${id}`,
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
