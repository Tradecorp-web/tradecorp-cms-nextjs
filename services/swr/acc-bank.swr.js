import useSWR, { mutate } from "swr";
import {
  getDetailPurchaseOrderApi,
  getListPurchaseOrderApi,
} from "../api/po.api";
import { getDetailAccBankApi, getListAccBankApi } from "../api/acc-bank.api";
import { swrOptions } from "./config.swr";

export function getListAccBankSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/po?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListAccBankApi(param),
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

export function getDetailAccBankSwr(id) {
  const fetcher = async () => getDetailAccBankApi(id);
  const { data, mutate, error } = useSWR(`/po/${id}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}
