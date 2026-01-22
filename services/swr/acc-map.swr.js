import useSWR, { mutate } from "swr";
import {
  getListAccMapApi,
  getAccMapIdApi,
  getAccMapCodeApi,
} from "../api/acc-map.api";
import { swrOptions } from "./config.swr";

export function getListAccMapSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/refaccmap?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListAccMapApi(param),
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

export function getDetailAccMapSwr(id) {
  const fetcher = async () => getAccMapIdApi(id);
  const { data, mutate, error } = useSWR(
    `/refaccmap/${id}`,
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

export function getAccMapCodeSwr(id) {
  const fetcher = async () => getAccMapCodeApi(id);
  const { data, mutate, error } = useSWR(
    `/refaccmapcode/${id}`,
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
