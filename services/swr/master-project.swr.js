import useSWR from "swr";
import {
  getDetailMasterProjectApi,
  getListMasterProjectApi,
} from "../api/master-project.api";
import { swrOptions } from "./config.swr";

export function masterProjectSwr(category = "", order = "") {
  const { data, mutate, error } = useSWR(
    `/master-project`,
    () => getListMasterProjectApi(category, order),
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
