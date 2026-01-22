import useSWR, { mutate } from "swr";
import {
  getDetailUserPosApi,
  getListUserPosApi,
  getListUserTeamApi,
} from "../api/user-pos.api";
import { swrOptions } from "./config.swr";

export function getListUserPosSwr(param) {
  var search = param?.search ?? "";
  var page = param?.page ?? 1;
  var limit = param?.limit ?? 0;
  const { data, mutate, error } = useSWR(
    `/user-pos?search=${search}&page=${page}&limit=${limit}&orderBy=${param?.orderBy}&order=${param?.order}&`,
    async () => getListUserPosApi(param),
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
export function getListUserTeamSwr(team) {
  const { data, mutate, error } = useSWR(
    `/userteam/${team}`,
    async () => getListUserTeamApi(team),
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

export function getDetailUserPosSwr(id) {
  const fetcher = async () => getDetailUserPosApi(id);
  const { data, mutate, error } = useSWR(
    `/user-pos/${id}`,
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
