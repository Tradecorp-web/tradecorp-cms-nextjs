import useSWR, { mutate } from "swr";
import { getListCoaTypeApi, getDetailCoaTypeApi } from "../api/coa-type.api";

import { swrOptions } from "./config.swr";

export function getListCoaTypeSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    `/acc-type?search=${search}&page=${page}&limit=${limit}`,
    async () => getListCoaTypeApi(param),
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

export function getDetailCoaTypeSwr(id) {
  const fetcher = async () => getDetailCoaTypeApi(id);
  const { data, mutate, error } = useSWR(
    `/acc-type/${id}`,
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
