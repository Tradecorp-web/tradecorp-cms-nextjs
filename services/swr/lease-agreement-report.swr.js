import useSWR, { mutate } from "swr";
import { getDetailLeaseAgreementHeaderApi } from "../api/lease-agreement-report.api";
import { swrOptions } from "./config.swr";

export function getDetailLeaseAgreementHeaderSwr(id) {
  const fetcher = async () => getDetailLeaseAgreementHeaderApi(id);
  const { data, mutate, error } = useSWR(
    `/lease-agreement-header/${id}`,
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
export function getDetailLeaseAgreementByAppendixASwr(header_id) {
  const fetcher = async () => getDetailLeaseAgreementAppendixAApi(header_id);
  const { data, mutate, error } = useSWR(
    `/lease-agreement-byappendix-a/${header_id}`,
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
