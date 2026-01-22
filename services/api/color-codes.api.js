import { requestApi } from "./main.api";

export const getColorListApi = async (order = "", orderBy = "") => {
  try {
    let param = "?order=" + order + "&orderBy=" + orderBy
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/color${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListColorCodesApi = async (search = "",page = 0,limit = 0,order = "", orderBy = "") => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    if (order != "" || orderBy != "") {
      param += "&order=" + order + "&orderBy=" + orderBy
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/color/list${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailColorCodesApi = async (code) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/color/${code}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteColorCodesApi = async (code) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/color/${code}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveColorCodesApi = async (data, code) => {
  try {
    var response = null;
    if (code == null || code == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/color`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/color/${code}`,
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
