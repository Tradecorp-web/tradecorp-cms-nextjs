import { requestApi } from "./main.api";

export const getListPaySubAccApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/pay-sub-acc${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailPaySubAccApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/pay-sub-acc/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getIdPaySubAccApi = async (
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
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/pay-sub-acc-sub/${subsidiary_code}${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const updatePaySubAccApi = async (id, data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/pay-sub-acc/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const updatePaySubAccDetailApi = async (id, data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/pay-sub-acc-detail/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
