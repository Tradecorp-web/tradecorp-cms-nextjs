import useSWR, { mutate } from "swr";
import {
  getDetailContainerStockApi,
  getListContainerStockApi,
  getListContainerStock2Api,
  getListContainerStock3Api,
  getLeasedContainerStockApi,
  getContainerForSaleApi,
} from "../api/container-stocks.api";
import { swrOptions } from "./config.swr";

export function getListContainerStockSwr(param) {
  var url = `/container?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  url += `size=${param?.size ?? ""}&`;
  url += `type=${param?.type ?? ""}&`;
  url += `yom=${param?.yom ?? ""}&`;
  url += `status=${param?.status ?? ""}&`;
  url += `condition=${param?.condition ?? ""}&`;
  url += `stockDepoId=${param?.stockDepoId ?? ""}&`;
  url += `depoId=${param?.depoId ?? ""}&`;
  url += `percentageFrom=${param?.percentageFrom ?? ""}&`;
  url += `percentageTo=${param?.percentageTo ?? ""}&`;
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListContainerStockApi(param),
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

export function getListContainerStock2Swr(param) {
  const { data, mutate, error } = useSWR(
    [`/container/list`, param],
    async () => getListContainerStock2Api(param),
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
export function getListContainerStock3Swr(param) {
  const { data, mutate, error } = useSWR(
    [`/container2/list`, param],
    async () => getListContainerStock3Api(param),
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

export function getListContainerForSaleSwr(param) {
  const { data, mutate, error } = useSWR(
    [`/container-forsale`, param],
    async () => getContainerForSaleApi(param),
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

export function getDetailContainerStockSwr(id) {
  const fetcher = async () => getDetailContainerStockApi(id);
  const { data, mutate, error } = useSWR(
    `/container/${id}`,
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

export function getLeasedContainerStockSwr(param) {
  const { data, mutate, error } = useSWR(
    [`/container/lease`, param],
    async () => getLeasedContainerStockApi(param),
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
