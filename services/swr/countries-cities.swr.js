import useSWR from "swr";
import {
  getCountryListApi,
  getCityListApi,
  getCurrencyListApi,
} from "../api/countries-cities.api";
import { swrOptions } from "./config.swr";

export function getCountryListSwr(id = "") {
  const { data, mutate, error } = useSWR(
    `/master/country?id=${id}`,
    async () => getCountryListApi(id),
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

export function getCityListSwr(id) {
  const { data, mutate, error } = useSWR(
    `/master/city/${id}`,
    async () => getCityListApi(id),
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
export function getCurrencyListSwr() {
  const { data, mutate, error } = useSWR(
    `/master/currency`,
    async () => getCurrencyListApi(),
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
