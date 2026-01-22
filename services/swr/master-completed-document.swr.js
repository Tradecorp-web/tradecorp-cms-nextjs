import useSWR, { mutate } from "swr";
import { swrOptions } from "./config.swr";
import { getListMasterCompletedDocNoLimitApi } from "../api/master-completed-document.api";

export function getListMasterCompletedDocNoLimitSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;

  const { data, mutate, error } = useSWR(
    `?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListMasterCompletedDocNoLimitApi(param),
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
