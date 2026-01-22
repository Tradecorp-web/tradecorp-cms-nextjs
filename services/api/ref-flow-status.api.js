import { requestApi } from "./main.api";

export const getListFlowStatusApi = async (modul, param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status-modul/${modul}?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=0&`;
  // url += `limit=${param?.limit ?? 20}&`;
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

export const getDetailFlowStatusApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status-detail/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertFlowStatusApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status-insert`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateFlowStatusApi = async (data, id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status-update/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteFlowStatusApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status-delete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
