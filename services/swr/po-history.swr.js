import useSWR, { mutate } from "swr";
import {
  getDetailPOPosApi,
  getDetailPurchaseOrderApi,
  getListPurchaseOrderApi,
  getListPOHistoryApi,
  getListDetailPOHistoryApi,
} from "../api/po.api";

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

export function getPOHistorySwr(po) {
  var search = "";
  var page = 1;
  var limit = 0;
  const { data, mutate, error } = useSWR(
    `/ref-status-app-module/purchase_order/${po}?search=${search}&page=${page}&limit=${limit}&orderBy=date_process&order=desc`,
    async () => getListPOHistoryApi(po),
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

export function getPoStatusDetailSwr(po, flowid) {
  var search = "";
  var page = 1;
  var limit = 0;
  const { data, mutate, error } = useSWR(
    `/get-status-app-module/purchase_order/${po}/${flowid}?search=${search}&page=${page}&limit=${limit}&orderBy=date_process&order=desc`,
    async () => getListDetailPOHistoryApi(po, flowid),
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
