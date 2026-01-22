import useSWR, { mutate } from "swr";
import {
  getDetailCustomerApi,
  getListCustomerApi,
  getListCompanyTypeApi,
} from "../api/customer.api";
import { swrOptions } from "./config.swr";

export function getListCustomerSwr(param) {
  let url = `/customer?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListCustomerApi(param),
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

export function getListCompanyTypeSwr(param) {
  var url = `/master-company-type?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListCompanyTypeApi(param),
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

export function getDetailCustomerSwr(id) {
  const fetcher = async () => getDetailCustomerApi(id);
  const { data, mutate, error } = useSWR(
    `/customer/${id}`,
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

export function getLogoSwr(id, file_id) {
  const fetcher = async () => getLogoSwr(id, file_id);
  const { data, mutate, error } = useSWR(
      `/customer-file-logo/${id}/${file_id}`,
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