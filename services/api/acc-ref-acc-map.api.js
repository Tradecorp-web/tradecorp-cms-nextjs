import { requestApi } from "./main.api";

export const getListRefAccMapApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/refaccmap${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailRefAccMapApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/refaccmap/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getRefAccMapParentDetailApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/refaccmap/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveRefAccMapApi = async (data) => {
  var tes = Object.values(data);
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/refaccmapinsert`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/refaccmapedit/${id}`,
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

export const deleteRefAccMapApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/refaccmapdelete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
