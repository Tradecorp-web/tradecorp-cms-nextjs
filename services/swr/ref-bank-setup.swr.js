import useSWR, { mutate } from "swr";
import { getRefBankSetupDetailApi } from "../api/ref-bank-setup.api";

import { swrOptions } from "./config.swr";

export function getRefBankSetupDetailSwr(id) {
  const fetcher = async () => getRefBankSetupDetailApi(id);
  const { data, mutate, error } = useSWR(`/coa/${id}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}
