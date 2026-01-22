import useSWR, { mutate } from "swr";
import {
  getDetailPOPosApi,
  getDetailPurchaseOrderApi,
  getListPurchaseOrderApi,
  getListPOGtZeroApi,
  getListAllPOApi,
  getPoUserPosApi,
  getCheckedPoApi,
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
export function getListAllPOSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/po?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListAllPOApi(param),
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
export function getListPOGtZeroSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/pogtzero?search=${search}&page=${page}&limit=${limit}&orderBy=po_date&order=desc&`,
    async () => getListPOGtZeroApi(param),
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
export function getPoUserPosSwr(id) {
  const fetcher = async () => getPoUserPosApi();
  const { data, mutate, error } = useSWR(
    `/get-po-userstatus`,
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
export function getCheckedPoSwr(id, statusAcc) {
  const fetcher = async () => getCheckedPoApi(id, statusAcc);
  const { data, mutate, error } = useSWR(
    `/get-po-ready-send/${id}/${statusAcc}`,
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
