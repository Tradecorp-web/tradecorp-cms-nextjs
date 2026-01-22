import useSWR from "swr";
import {
  getListContainerNumberApi,
  getDetailContainerNumberApi,
  getDetailContainerSerialUnitcodeApi,getCntFilterApi,getCntAvailableApi
} from "../api/container-number.api";
import { swrOptions } from "./config.swr";

export function getListContainerNumberSwr(param) {
  var url = `/container-serial?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;

  const { data, mutate, error } = useSWR(
    `${url}`,
    async () => getListContainerNumberApi(param),
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

export function getListContainerNumberSwrx() {
  const fetcher = async () => getListContainerNumberApi();
  const { data, mutate, error } = useSWR(
    `/container-serial`,
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
export function getDetailContainerNumberSwr(id) {
  const fetcher = async () => getDetailContainerNumberApi(size);
  const { data, mutate, error } = useSWR(
    `/container-serial`,
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
export function getDetailContainerSerialUnitcodeSwr(unit_code) {
  const fetcher = async () => getDetailContainerSerialUnitcodeApi(unit_code);
  const { data, mutate, error } = useSWR(
    `/container-serial-unitcode`,
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
export function getCntFilterSwr(prefix,value) {
  const fetcher = async () => getCntFilterApi(prefix,value);
  const { data, mutate, error } = useSWR(
    `/container-serial-filter`,
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
export function getCntAvailableSwr(prefix) {
  const fetcher = async () => getCntAvailableApi(prefix);
  const { data, mutate, error } = useSWR(
    `/container-serial-available`,
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

// import useSWR from "swr";
// import {
//   getListContainerNumberApi,
//   getDetailContainerNumberApi,
//   getDetailContainerSerialUnitcodeApi,
// } from "../api/container-number.api";
// import { swrOptions } from "./config.swr";

// export function getListContainerNumberSwr(param) {
//   var url = `/container-serial?`;
//   url += `search=${param?.search ?? ""}&`;
//   url += `page=${param?.page ?? 1}&`;
//   url += `limit=${param?.limit ?? 20}&`;
//   url += `orderBy=${param?.orderBy ?? ""}&`;
//   url += `order=${param?.order ?? ""}&`;

//   const { data, mutate, error } = useSWR(
//     `${url}`,
//     async () => getListContainerNumberApi(param),
//     swrOptions
//   );
//   const isLoading = !data && !error;

//   return {
//     isLoading,
//     data,
//     error,
//     mutate,
//   };
// }

// export function getListContainerNumberSwrx() {
//   const fetcher = async () => getListContainerNumberApi();
//   const { data, mutate, error } = useSWR(
//     `/container-serial`,
//     fetcher,
//     swrOptions
//   );
//   const isLoading = !data && !error;

//   return {
//     isLoading,
//     data,
//     error,
//     mutate,
//   };
// }
// export function getDetailContainerNumberSwr(id) {
//   const fetcher = async () => getDetailContainerNumberApi(size);
//   const { data, mutate, error } = useSWR(
//     `/container-serial`,
//     fetcher,
//     swrOptions
//   );
//   const isLoading = !data && !error;

//   return {
//     isLoading,
//     data,
//     error,
//     mutate,
//   };
// }
// export function getDetailContainerSerialUnitcodeSwr(unit_code) {
//   const fetcher = async () => getDetailContainerSerialUnitcodeApi(unit_code);
//   const { data, mutate, error } = useSWR(
//     `/container-serial-unitcode`,
//     fetcher,
//     swrOptions
//   );
//   const isLoading = !data && !error;

//   return {
//     isLoading,
//     data,
//     error,
//     mutate,
//   };
// }
