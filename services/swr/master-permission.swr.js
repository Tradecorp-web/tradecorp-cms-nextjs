import useSWR from "swr";
import {
  getListMasterPermissionApi,
  getModuleIdApi,
} from "../api/master-permission.api";
import { swrOptions } from "./config.swr";

export function masterPermissionSwr(orderBy = "", order = "") {
  const { data, mutate, error } = useSWR(
    `/ref-permission-list?search=&page=1&limit=20&orderBy=${orderBy}&order=${order}`,
    () => getListMasterPermissionApi(),
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
export function getIdModulSwr(modul) {
  const { data, mutate, error } = useSWR(
    `/ref-get-permission-id/${modul}?search=&page=1&limit=20&orderBy=&order=`,
    () => getModuleIdApi(modul),
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
