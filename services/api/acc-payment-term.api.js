import { requestApi } from "./main.api";

export const getListAccPaymentTermApi = async (
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
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-payment-term${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailAccPaymentTermApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-payment-term/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveAccPaymentTermApi = async (data) => {
  var response = null;
  response = await requestApi({
    url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-payment-term-insert`,
    method: "POST",
    body: data,
    isAuth: true,
  });
  return response;
};
