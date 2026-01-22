import useSWR from "swr";
import {getDetailSalesTeamApi, getListUserApi2} from "../api/user.api";
import { swrOptions } from "./config.swr";

export function masterUserSwr(param) {
  var url = `/user?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `companyId=${param?.companyId ?? ""}&`
  url += `officeId=${param?.officeId ?? ""}&`
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListUserApi2(param), 
    swrOptions
  )
  const isLoading = !data && !error
  
  return {
    isLoading,
    data,
    error,
    mutate
  };
}

export function getDetailSalesTeamSwr(teamid) {

  const fetcher = async () => getDetailSalesTeamApi(teamid);
  const { data, mutate, error } = useSWR(`/userteam/${teamid}`, fetcher, swrOptions);
  const isLoading = !data && !error;

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}