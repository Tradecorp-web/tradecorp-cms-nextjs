import useSWR, { mutate } from "swr";

import { getColorListApi } from "../api/color-codes.api";

import { swrOptions } from "./config.swr";

export function getColorListSwr(order = "", orderBy = "") {
    let param = "?order=" + order + "&orderBy=" + orderBy

  const { data, mutate, error } = useSWR(
    `/master/color${param}`,
    async () => getColorListApi(param),
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
