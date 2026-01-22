import useSWR, { cache } from "swr";
import { accountApi } from "../api/account.api";
import { swrOptions } from "./config.swr";

export function accountSwr() {
    const { data, mutate, error } = useSWR("/account", accountApi, swrOptions)
  
    const isLoading = !data && !error
  
    return {
      isLoading,
      data,
      error,
      mutate
    };
  }
  