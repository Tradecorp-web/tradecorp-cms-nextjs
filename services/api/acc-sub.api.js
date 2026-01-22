import { requestApi } from "./main.api";

export const getListSubAccApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sub-acc${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailSubAccApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sub-acc/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListSubAccStatusApi = async (
  status = "",
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;

    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + 0;
    }
    param += "&orderBy=subsidiary_code&order=asc";

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sub-acc-status/${status}${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getIdSubAccApi = async (
  subsidiary_code = "",
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;

    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + 0;
    }
    param += "&orderBy=subsidiary_code&order=asc";

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sub-acc-sub/${subsidiary_code}${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const updateSubAccDetailApi = async (id, data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sub-acc-detail/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
