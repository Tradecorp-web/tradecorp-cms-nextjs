import { requestApi, requestRawApi } from "./main.api";

export const getListCustomerApi = async (param) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/customer?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getListCompanyTypeApi = async (param) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/master-company-type?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 0}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  //   url += `orderBy="name"}&`;
  url += `order=${param?.order ?? ""}&`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const getDetailCustomerApi = async (id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer/${id}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const insertCustomerApi = async (data) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer`,
      method: "POST",
      body: data,
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const updateCustomerApi = async (data, id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-update/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const deleteCustomerApi = async (id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer/${id}`,
      method: "DELETE",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const insertFileCustomerLogoApi = async (id, data) => {
  try {
    let response;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-file-logo-insert/${id}`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const insertFileCustomerNpwpApi = async (id, data) => {
  try {
    let response;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-file-npwp-insert/${id}`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getLogoApi = async (id, file_id) => {
  try {
    return await requestRawApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-file-logo/${id}/dl/${file_id}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const getNpwpApi = async (id, file_id) => {
  try {
    return await requestRawApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-file-npwp/${id}/dl/${file_id}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const deleteCustomerFile = async (file_id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-file-delete}/${file_id}`,
      method: "PUT",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
