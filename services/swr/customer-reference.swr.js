import useSWR, { mutate } from "swr";
import {
  getDetailCustomerReferenceApi,
  getListCustomerReferenceApi,
} from "../api/customer-reference.api";
import { swrOptions } from "./config.swr";

export function getListCustomerReferenceSwr(param) {
  let url = `/customer-reference?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListCustomerReferenceApi(param),
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

export function getDetailCustomerReferenceSwr(id) {
  const fetcher = async () => getDetailCustomerReferenceApi(id);
  const { data, mutate, error } = useSWR(
    `/customer-reference/${id}`,
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