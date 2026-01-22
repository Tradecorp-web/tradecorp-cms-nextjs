import useSWR, { mutate } from "swr";
import { getListAccTrxJournalApi } from "../api/acc-trx-journal.api";
import { swrOptions } from "./config.swr";

export function getListAccTrxJournalSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 20;
  const { data, mutate, error } = useSWR(
    `/trx-journal?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListAccTrxJournalApi(param),
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
