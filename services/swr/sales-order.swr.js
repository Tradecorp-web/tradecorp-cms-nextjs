import useSWR, { mutate } from "swr";
import {
  getListSalesOrderApi,
  getDetailSalesOrderApi,
  getSOStatusAccApi,
  getSOGroupApi,
  getSOProjectListApi,
} from "../api/sales-order.api";
import { getListInvoiceByProjectApi } from "../api/invoice.api";
import { swrOptions } from "./config.swr";

export function getListSalesOrderSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/sales-order?search=${search}&page=${page}&limit=${limit}&`,
    async () => getListSalesOrderApi(param),
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

export function getDetailSalesOrderSwr(id) {
  const fetcher = async () => getDetailSalesOrderApi(id);
  const { data, mutate, error } = useSWR(
    `/sales-order/${id}`,
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

export function getInvoiceProjectSwr(project_code) {
  const fetcher = async () => getListInvoiceByProjectApi(project_code);
  const { data, mutate, error } = useSWR(
    `/invoice-by-project/${project_code}?orderBy=payment_term`,
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

export function getListSOStatusAcc(statusAcc) {
  const { data, mutate, error } = useSWR(
    `/sales-order-status/${statusAcc}`,
    async () => getSOStatusAccApi(statusAcc),
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
export function getListSOGroup(field, criteria) {
  const { data, mutate, error } = useSWR(
    `/sales-order-group/${field}/${criteria}`,
    async () => getSOGroupApi(field, criteria),
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

export function getListPaymentTerm() {
  const { data, mutate, error } = useSWR(
    `/payment-term`,
    async () => getPaymentTermApi(),
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
export function getListProject(projectCode, incomeType) {
  const { data, mutate, error } = useSWR(
    `/sales-order-project/${projectCode}/${incomeType}`,
    async () => getSOProjectListApi(projectCode, incomeType),
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
