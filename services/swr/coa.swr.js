import useSWR, { mutate } from "swr";
import {
  getDetailMaterialApi,
  getListMaterialApi,
  getListMaterialStockHistoriesApi,
} from "../api/material.api";
import { getDetailCoaApi, getListCoaApi, getCoaSalesApi } from "../api/coa.api";

import { swrOptions } from "./config.swr";

export function getListCoaSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    `/coa?search=${search}&page=${page}&limit=${limit}`,
    async () => getListCoaApi(param),
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

export function getDetailCoaSwr(id) {
  const fetcher = async () => getDetailCoaApi(id);
  const { data, mutate, error } = useSWR(`/coa/${id}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}

export function getCoaSalesSwr() {

  const { data, mutate, error } = useSWR(
      `/coa-sales`,
      async () => getCoaSalesApi(),
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


export function getCoaContraSalesSwr(param) {
  let search = "Current Asset";
  let page = param?.page ?? 1;
  let limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
      `/coa?search=${search}&page=${page}&limit=${limit}`,
      async () => getListCoaApi(),
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
