import useSWR from "swr";
import {
  getListOrderIdQuoteApi,
  getListOrderIdQuoteStatusApi,
  getListOrderQuoteStatusGroupApi,
} from "../api/order-quote.api";
import { swrOptions } from "./config.swr";

export function getListOrderIdQuoteSwr(id, size = "*") {
  const fetcher = async () => getListOrderIdQuoteApi(id, size);
  const { data, mutate, error } = useSWR(
    `/order-idquote/${id}/${size}`,
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
export function getListOrderIdQuoteStatusSwr(size = "*", status) {
  const fetcher = async () => getListOrderIdQuoteStatusApi(size, status);
  const { data, mutate, error } = useSWR(
    `/order-idquote-status/${size}/${status}?orderby=container_size_data&order=asc`,
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
export function getListOrderQuoteStatusGroupSwr(size = "*", status) {
  const fetcher = async () => getListOrderQuoteStatusGroupApi(status);
  const { data, mutate, error } = useSWR(
    `/order-quote-status-group/${size}/${status}`,
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

//order-quote-status/production?orderby=container_size_data
