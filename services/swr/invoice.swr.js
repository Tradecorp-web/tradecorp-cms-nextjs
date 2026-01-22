import useSWR, { mutate } from "swr";
import {
  getListInvoiceApi,
  getListInvoiceBySalesOrderNumberApi,
  getInvPaymentDataApi,
  getDetailInvoiceApi,
} from "../api/invoice.api";
import { getDetailSalesOrderApi } from "../api/sales-order.api";
import { swrOptions } from "./config.swr";
import { getListContainerStockApi } from "../api/container-stocks.api";

export function getListInvoiceBySalesSwr(param) {
  let search = param?.search ?? "";
  let page = param?.page ?? 1;
  let limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/wo?search=${search}&page=${page}&limit=${limit}&`,
    async () => getListInvoiceApi(param),
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

// export function getListInvoiceSwr(param) {
//   let search = param?.search ?? "";
//
//   const { data, mutate, error } = useSWR(
//       `/invoice?search=${search}`,
//       async () => getListInvoiceApi(param),
//       swrOptions
//   );
//   const isLoading = !data && !error;
//
//   return {
//     isLoading,
//     data,
//     error,
//     mutate,
//   };
// }

export function getListInvoiceSwr(param) {
  let url = `/invoice?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  url += `status_invoice=${param?.status_invoice ?? ""}&`;
  url += `sales_id=${param?.sales_id ?? ""}&`;
  url += `customer_id=${param?.customer_id ?? ""}&`;
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListInvoiceApi(param),
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

export function getListSalesOrderNumberSwr(sales_order_id) {
  // let search = param?.search ?? "";
  const { data, mutate, error } = useSWR(
    `/invoice-by-sales-order-number/${sales_order_id}`,
    async () => getListInvoiceBySalesOrderNumberApi(sales_order_id),
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

export function getListInvPaymentSwr(field, criteria) {
  const { data, mutate, error } = useSWR(
    `/invoice-payment/${field}/${criteria}`,
    async () => getInvPaymentDataApi(field, criteria),
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
export function getInvoiceDetailSwr(id) {
  const { data, mutate, error } = useSWR(
    `/invoice/${id}`,
    async () => getDetailInvoiceApi(id),
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
