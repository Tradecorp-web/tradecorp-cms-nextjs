import useSWR, { mutate } from "swr";

import { getListRefFlowApi } from "../api/ref_flow.api";

import { swrOptions } from "./config.swr";

export function getListFlowSwr(param, modul) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/ref-flow-status-data/${modul}?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListRefFlowApi(param, modul),
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
