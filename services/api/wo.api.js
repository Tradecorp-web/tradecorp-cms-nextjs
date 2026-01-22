import { stringify } from "uuid";
import { requestApi } from "./main.api";

export const getListWOApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=wo_date&order=desc";
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wo${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getListAllWOApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wolist${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getListWOStatusApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param +=
        "&page=" + page + "&limit=" + limit + "&orderBy=wo_date&order=desc&";
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wogtzero${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailWOApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wo/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteWOApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wo/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveWOApi = async (data) => {
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wo`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wo/${id}`,
        method: "PUT",
        body: data,
        isAuth: true,
      });
    }
    return response;
  } catch (err) {
    throw err;
  }
};

export const addHistoryApi = async (data) => {
  try {
    var id = data.id;
    var response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wo/history/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateWoWhenPoCreatedApi = async (woId) => {
  try {
    var response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/wo/po-created/${woId}`,
      method: "PATCH",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateWOFlowNext = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/woflownext/${id}`,
      method: "PUT",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

//history
export const getListWOHistoryApi = async (wo) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-status-app-module/wo/${wo}?`;
  url += `search=&`;
  url += `page=&`;
  url += `limit=&`;
  url += `orderBy=date_process&`;
  url += `order=desc`;

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
//==history

export const getWoUserPosApi = async () => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-wo-userstatus`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getWoNumberApi = async (project) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-wo-number/${project}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
