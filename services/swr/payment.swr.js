import useSWR, { mutate } from "swr";
import {
  getListPaymentApi,
  getDetailPaymentApi,
  getListPaymentCriteriaApi,
  getPaymentInInvApi,
  getListPaymentByIdApi,
} from "../api/payment.api";
import { swrOptions } from "./config.swr";

export function getListPaymentSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/payment?search=${search}&page=${page}&limit=${limit}&`,
    async () => getListPaymentApi(param),
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
export function getListPaymentCriteriaSwr(method, type, param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/payment/${method}/${type}?search=${search}&page=${page}&limit=${limit}&`,
    async () => getListPaymentCriteriaApi(method, type, param),
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

export function getDetailPaymentSwr(id) {
  const fetcher = async () => getDetailPaymentApi(id);
  const { data, mutate, error } = useSWR(`/payment/${id}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}

export function getPaymentInInvSwrx(idPayment) {
  const fetcher = async () => getPaymentInInvApi(idPayment);
  const { data, mutate, error } = useSWR(
    `/payment-in-invoice`,
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

export function getPaymentInInvSwr(idPayment) {
  const { data, mutate, error } = useSWR(
    `/payment-in-invoice`,
    async () => getPaymentInInvApi(idPayment),
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

export function getListPaymentByIdSwr(payinv, id) {
  const fetcher = async () => getListPaymentByIdApi(payinv, id);
  const { data, mutate, error } = useSWR(
    `/payment-agg-src-id/${payinv}/${id}`,
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

export function getListPaymentByIdSwrx(idPayment) {
  const { data, mutate, error } = useSWR(
    `/payment-agg-src-id`,
    async () => getListPaymentByIdApi(idPayment),
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
