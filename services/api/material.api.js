import { dateFormatInput } from "../../helpers/general";
import { requestApi } from "./main.api";

export const getListMaterialApi = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/material?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  url += `category=${param?.category ?? ""}&`;
  url += `vendor=${param?.vendor ?? ""}&`;
  url += `underMinimumStock=${param?.underMinimumStock ?? false}&`;
  url += `priceExpired=${param?.priceExpired ?? false}&`;
  try {
    const response = await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailMaterialApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertMaterialApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateMaterialApi = async (data, id) => {
  try {
    data.expiration_date =
      data.expiration_date != null
        ? dateFormatInput(data.expiration_date)
        : null;
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteMaterialApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertMaterialVendorApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material-vendor`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateMaterialVendorApi = async (data, id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material-vendor/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteMaterialVendorApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material-vendor/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListMaterialStockHistoriesApi = async (param, id) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/material/${id}/stock-histories?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  try {
    const response = await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertMaterialStockHistoryApi = async (data, id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material/${id}/stock-histories`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
