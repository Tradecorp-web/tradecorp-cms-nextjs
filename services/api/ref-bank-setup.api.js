import { requestApi, requestRawApi } from "./main.api";

export const getListRefBankSetupApi = async (
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=&order=";
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-bank-setup${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getRefBankSetupDetailApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-bank-setup-subid/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
