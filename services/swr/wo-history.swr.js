import useSWR, { mutate } from "swr";
import {
  getDetailPOPosApi,
  getDetailPurchaseOrderApi,
  getListPurchaseOrderApi,
  getListPOHistoryApi,
} from "../api/po.api";
import { getListWOHistoryApi } from "../api/wo.api";
import { getListHistoryApi } from "../api/send-data.api";

import { swrOptions } from "./config.swr";

export function getListPurchaseOrderSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/postatus?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListPurchaseOrderApi(param),
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
export function getPoPosSwr(modul_id, position_id) {
  const fetcher = async () => getDetailPOPosApi(modul_id, position_id);
  const { data, mutate, error } = useSWR(
    `/ref-flow-status/${modul_id}/${position_id}`,
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

export function getDetailPurchaseOrderSwr(id) {
  const fetcher = async () => getDetailPurchaseOrderApi(id);
  const { data, mutate, error } = useSWR(`/po/${id}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}

export function getWOHistorySwr(wo) {
  var search = "";
  var page = 1;
  var limit = 20;

  const { data, mutate, error } = useSWR(
    `/ref-status-app-module/wo/${wo}?search=${search}&page=${page}&limit=${limit}&orderBy=date_process&order=desc`,
    async () => getListWOHistoryApi(wo),
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
