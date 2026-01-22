import useSWR from "swr";
import { getDepoNewsApi, getDetailDepoApi, getListDepoApi, getListDepoGApi, getListDepoNoLimitApi,getListDepoGCountryApi,getListDepo2GApi } from "../api/depo.api";
import { swrOptions } from "./config.swr";

export function getListDepoSwr(param) {
  var url = `/depo?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `isOwn=${param?.isOwn ?? ""}&`
  url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListDepoApi(param),
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

export function getListDepoNoLimitSwr(param) {
  var url = `/depo-nolimit2/${param?.group}?`
  url += `search=${param?.search ?? ""}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `isOwn=${param?.isOwn ?? ""}&`
  url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListDepoNoLimitApi(param),
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

export function getListDepoGCountrySwr(param) {
  var url = `/depo-nolimit/${param?.group}?`
  url += `search=${param?.search ?? ""}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `isOwn=${param?.isOwn ?? ""}&`
  url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`
  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListDepoGCountryApi(param),
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


export function getListDepoGSwr(param,group) {
  var url = `/depo/group/${group}?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `isOwn=${param?.isOwn ?? ""}&`
  url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`

  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListDepoGApi(param, group),
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


export function getListDepo2GSwr(param,group) {
  var url = `/depo2/group/${group}?`
  url += `search=${param?.search ?? ""}&`
  url += `page=${param?.page ?? 1}&`
  url += `limit=${param?.limit ?? 20}&`
  url += `orderBy=${param?.orderBy ?? ""}&`
  url += `order=${param?.order ?? ""}&`
  url += `isOwn=${param?.isOwn ?? ""}&`
  url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`

  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListDepo2GApi(param, group),
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


export function getDetailDepoSwr(id) {
  const fetcher = async () => getDetailDepoApi(id)
  const { data, mutate, error } = useSWR(`/vendor/${id}`, fetcher, swrOptions)
  const isLoading = !data && !error

  return {
    isLoading,
    data,
    error,
    mutate
  };
}

export function getDepoNewsSwr() {
  const fetcher = async () => getDepoNewsApi()
  const { data, mutate, error } = useSWR(
    "https://www.freightwaves.com/wp-json/wp/v2/posts",
    fetcher,
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
