import useSWR from "swr";
import { getRefCsnApi, getLastNumberApi } from "../api/ref-number.api";
import { swrOptions } from "./config.swr";

export function getRefCsnSwr(prefix) {
  const fetcher = async () => getRefCsnApi(prefix);
  const { data, mutate, error } = useSWR(
    `/get-last-number-csn/${prefix}`,
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
export function getLastNumberSwr(aplcode) {
  const fetcher = async () => getLastNumberApi(aplcode);
  const { data, mutate, error } = useSWR(
    `/get-last-number/${aplcode}`,
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
