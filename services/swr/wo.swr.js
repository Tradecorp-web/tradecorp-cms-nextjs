import useSWR, { mutate } from "swr";
import {
  getDetailWOApi,
  getListWOApi,
  getListWOStatusApi,
  getWoUserPosApi,
  getListAllWOApi,
} from "../api/wo.api";
import { swrOptions } from "./config.swr";

export function getListWorkOrderSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/wo?search=${search}&page=${page}&limit=${limit}&`,
    async () => getListWOApi(param),
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
export function getListWoAllSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/wolist?search=${search}&page=${page}&limit=${limit}&`,
    async () => getListAllWOApi(param),
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
export function getListWoStatusSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    `/wogtzero?search=${search}&page=${page}&limit=${limit}&orderBy=wo_date&order=desc&`,
    async () => getListWOStatusApi(param),
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

export function getDetailWorkOrderSwr(id) {
  const fetcher = async () => getDetailWOApi(id);
  const { data, mutate, error } = useSWR(`/wo/${id}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}

export function getWoUserPosSwr(id) {
  const fetcher = async () => getWoUserPosApi();
  const { data, mutate, error } = useSWR(
    `/get-wo-userstatus`,
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
