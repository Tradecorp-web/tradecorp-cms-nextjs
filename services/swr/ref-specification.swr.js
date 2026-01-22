import useSWR from "swr";
import { getSpecificationApi } from "../api/ref-specificaton.api";
import { swrOptions } from "./config.swr";

export function getSpecificationSwr() {
  const fetcher = async () =>
    getSpecificationApi({ orderBy: "ref-specification", order: "asc" });
  const { data, mutate, error } = useSWR(
    `/getSpecificationApi`,
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
