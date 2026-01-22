import { requestApi } from "./main.api";

export const getListAccBankApi = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/accbank?`;
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

export const getDetailAccBankApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/accbank/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertAccBankApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/accbank`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateAccBankApi = async (data, id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/accbank/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteAccBankApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/accbank/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
